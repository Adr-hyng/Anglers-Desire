import { system } from "@minecraft/server";
import CuboidRegion from "../Region/CuboidRegion";
import { BlockSafetyCheckerUtility } from "../BlockSafetyChecker/BlockSafetyCheckerUtility";
import { BlockSafetyCheckerOptions } from "../BlockSafetyChecker/BlockSafetyCheckerOptions";
import { Vec3 } from "utils/Vector/VectorUtils";
import { MinecraftBlockTypes } from "vanilla-types/index";
export class AStar {
    constructor(options) {
        this.Options = options;
        this.TotalDebugBlocksCreated = new Set();
        let startBlock;
        let endBlock;
        try {
            startBlock = this.Options.Dimension.getBlock(this.Options.StartLocation);
            endBlock = this.Options.Dimension.getBlock(this.Options.GoalLocation);
        }
        catch (e) {
        }
        if (startBlock !== undefined && endBlock !== undefined) {
            this.StartBlock = startBlock;
            this.EndBlock = endBlock;
        }
        else {
            throw "Start and End must point to valid and loaded blocks.";
        }
    }
    async Pathfind() {
        const goalNode = await new Promise(goalNodeResolve => {
            system.runJob(this.IterateUntilGoalBlockReached(goalNodeResolve));
        });
        const blockPath = [];
        let currentNode = goalNode;
        while (currentNode !== null) {
            blockPath.push(currentNode.Block);
            currentNode = currentNode.ParentNode;
        }
        this.ClearDebugBlocks();
        return blockPath.reverse();
    }
    *IterateUntilGoalBlockReached(goalNodePromiseResolve) {
        const openList = [
            {
                Block: this.StartBlock,
                ParentNode: null,
                FCost: this.CalculateFCost(this.StartBlock),
                GCost: this.CalculateGCost(this.StartBlock),
                HCost: this.CalculateHHeuristic(this.StartBlock),
            }
        ];
        const closedListLocations = {};
        while (openList.length > 0) {
            if (Object.keys(closedListLocations).length >= this.Options.MaximumNodesToConsider) {
                this.ClearDebugBlocks();
                throw "Maximum number of nodes considered. MaximumNodesToConsider limit option hit.";
            }
            const nextIndex = this.GetIndexOfNodeWithLowestFCost(openList);
            const nextNode = openList[nextIndex];
            const locationHash = Vec3.toString(nextNode.Block.location);
            if (Vec3.equals(nextNode.Block, this.EndBlock)) {
                return goalNodePromiseResolve(nextNode);
            }
            openList.splice(nextIndex, 1);
            closedListLocations[locationHash] = nextNode;
            let surroundingLocations;
            if (!this.Options.AllowYAxisFlood) {
                surroundingLocations = CuboidRegion.FromCenterLocation(nextNode.Block.location, 1, true).GetAllLocationsInRegion();
            }
            else {
                surroundingLocations = CuboidRegion.GetAdjacentPositions(nextNode.Block.location, 1);
            }
            const surroundingBlocks = [];
            const safetyCheckOptions = new BlockSafetyCheckerOptions();
            safetyCheckOptions.TagsToConsiderPassable = this.Options.TagsToConsiderPassable;
            safetyCheckOptions.TypeIdsToConsiderPassable = this.Options.TypeIdsToConsiderPassable;
            safetyCheckOptions.TypeIdsThatCannotBeJumpedOver = this.Options.TypeIdsThatCannotBeJumpedOver;
            safetyCheckOptions.AllowYAxisFlood = this.Options.AllowYAxisFlood;
            for (const location of surroundingLocations) {
                let blockAtLocation;
                try {
                    blockAtLocation = this.Options.Dimension.getBlock(location);
                }
                catch (e) { }
                if (blockAtLocation !== undefined && blockAtLocation.isValid()) {
                    if (Vec3.equals(location, this.Options.GoalLocation)) {
                        surroundingBlocks.push(blockAtLocation);
                    }
                    else {
                        const safetyCheckResult = BlockSafetyCheckerUtility.RunBlockSafetyCheck(blockAtLocation, safetyCheckOptions);
                        if (safetyCheckResult.IsSafe) {
                            if (safetyCheckOptions.AllowYAxisFlood) {
                                const belowBlock = blockAtLocation.below();
                                const bottomSafetyCheckResult = BlockSafetyCheckerUtility.RunBlockSafetyCheck(belowBlock, safetyCheckOptions);
                                const upBlock = blockAtLocation.above();
                                const topSafetyCheckResult = BlockSafetyCheckerUtility.RunBlockSafetyCheck(upBlock, safetyCheckOptions);
                                if (bottomSafetyCheckResult.IsSafe) {
                                    surroundingBlocks.push(belowBlock);
                                }
                                if (topSafetyCheckResult.IsSafe) {
                                    surroundingBlocks.push(upBlock);
                                }
                                surroundingBlocks.push(blockAtLocation);
                                continue;
                            }
                            if (safetyCheckResult.CanSafelyFallFrom) {
                                surroundingBlocks.push(blockAtLocation.below(1));
                            }
                            else if (safetyCheckResult.CanSafelyJumpOnto) {
                                surroundingBlocks.push(blockAtLocation.above(1));
                            }
                            else {
                                surroundingBlocks.push(blockAtLocation);
                            }
                        }
                    }
                }
                yield;
            }
            for (const surroundingBlock of surroundingBlocks) {
                const surroundingNode = {
                    Block: surroundingBlock,
                    ParentNode: nextNode,
                    FCost: this.CalculateFCost(surroundingBlock),
                    GCost: nextNode.GCost + 1,
                    HCost: this.CalculateHHeuristic(surroundingBlock),
                };
                const surroundingBlockLocationHash = Vec3.toString(surroundingBlock.location);
                if (Vec3.equals(surroundingBlock, this.EndBlock)) {
                    return goalNodePromiseResolve(surroundingNode);
                }
                if (surroundingBlockLocationHash in closedListLocations) {
                    continue;
                }
                this.SetDebugBlock(surroundingBlock);
                const indexOfExistingNodeInOpenList = this.GetIndexOfNodeIfInList(surroundingNode, openList);
                if (indexOfExistingNodeInOpenList === null) {
                    openList.push(surroundingNode);
                }
                else {
                    if (openList[indexOfExistingNodeInOpenList].GCost > surroundingNode.GCost) {
                        openList[indexOfExistingNodeInOpenList].GCost = surroundingNode.GCost;
                        openList[indexOfExistingNodeInOpenList].ParentNode = surroundingNode.ParentNode;
                    }
                }
                yield;
            }
        }
        this.ClearDebugBlocks();
        throw "No path could be found to the destination. All adjacent moveable nodes to consider has been exhausted.";
    }
    SetDebugBlock(block) {
        if (!this.Options.DebugMode)
            return;
        if (!(Vec3.toString(block.location)
            in
                [...this.TotalDebugBlocksCreated].map((b) => Vec3.toString(b.location))))
            this.TotalDebugBlocksCreated.add(block);
        this.Options.Dimension.setBlockType(block, MinecraftBlockTypes.StructureVoid);
    }
    ClearDebugBlocks() {
        if (!this.Options.DebugMode)
            return;
        const locs = this.TotalDebugBlocksCreated;
        const safetyCheckOptions = new BlockSafetyCheckerOptions();
        safetyCheckOptions.TagsToConsiderPassable = this.Options.TagsToConsiderPassable;
        safetyCheckOptions.TypeIdsToConsiderPassable = this.Options.TypeIdsToConsiderPassable;
        safetyCheckOptions.TypeIdsThatCannotBeJumpedOver = this.Options.TypeIdsThatCannotBeJumpedOver;
        safetyCheckOptions.AllowYAxisFlood = this.Options.AllowYAxisFlood;
        for (const v of locs) {
            system.run(() => {
                const vx = v.location;
                if (Vec3.equals(vx, this.Options.StartLocation) || Vec3.equals(vx, this.Options.GoalLocation))
                    return;
                if (!v.matches(MinecraftBlockTypes.StructureVoid))
                    return;
                this.Options.Dimension.setBlockType(vx, MinecraftBlockTypes.Air);
            });
        }
    }
    GetIndexOfNodeIfInList(node, listOfNodes) {
        for (const index in listOfNodes) {
            const indexNumber = parseInt(index);
            const nodeInList = listOfNodes[indexNumber];
            if (Vec3.equals(node.Block, nodeInList.Block)) {
                return indexNumber;
            }
        }
        return null;
    }
    GetIndexOfNodeWithLowestFCost(listOfNodes) {
        let currentLowestIndex = -1;
        let currentLowestFCost = -1;
        for (const index in listOfNodes) {
            let indexNumber = parseInt(index);
            if (currentLowestIndex === -1) {
                currentLowestFCost = this.CalculateFCost(listOfNodes[indexNumber].Block);
                currentLowestIndex = indexNumber;
            }
            else {
                const thisFCost = this.CalculateFCost(listOfNodes[indexNumber].Block);
                if (thisFCost < currentLowestFCost) {
                    currentLowestFCost = thisFCost;
                    currentLowestIndex = indexNumber;
                }
            }
        }
        return currentLowestIndex;
    }
    CalculateFCost(block) {
        return this.CalculateGCost(block) + this.CalculateHHeuristic(block);
    }
    CalculateGCost(block) {
        return Vec3.distance(block.location, this.Options.StartLocation);
    }
    CalculateHHeuristic(block) {
        return Vec3.distance(block.location, this.Options.GoalLocation);
    }
}
