import { system } from "@minecraft/server";
import CuboidRegion from "../Region/CuboidRegion";
import { BlockSafetyCheckerUtility } from "../BlockSafetyChecker/BlockSafetyCheckerUtility";
import { BlockSafetyCheckerOptions } from "../BlockSafetyChecker/BlockSafetyCheckerOptions";
import { Vec3 } from "utils/Vector/VectorUtils";
import { MinecraftBlockTypes } from "vanilla-types/index";
export class BidirectionalAStar {
    constructor(options) {
        this.Options = options;
        this.TotalDebugBlocksCreated = new Set();
        let startBlock;
        let endBlock;
        try {
            startBlock = this.Options.Dimension.getBlock(this.Options.StartLocation);
            endBlock = this.Options.Dimension.getBlock(this.Options.GoalLocation);
        }
        catch (e) { }
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
        let currentNode = goalNode;
        this.ClearDebugBlocks();
        return currentNode.map(n => n.Block).reverse();
    }
    *IterateUntilGoalBlockReached(goalNodePromiseResolve) {
        const openList = [
            {
                Block: this.StartBlock,
                ParentNode: null,
                FCost: this.CalculateFCost(this.StartBlock, this.Options.StartLocation, this.Options.GoalLocation),
                GCost: this.CalculateGCost(this.StartBlock, this.Options.StartLocation),
                HCost: this.CalculateHHeuristic(this.StartBlock, this.Options.GoalLocation),
            }
        ];
        const reverseOpenList = [
            {
                Block: this.EndBlock,
                ParentNode: null,
                FCost: this.CalculateFCost(this.EndBlock, this.Options.GoalLocation, this.Options.StartLocation),
                GCost: this.CalculateGCost(this.EndBlock, this.Options.GoalLocation),
                HCost: this.CalculateHHeuristic(this.EndBlock, this.Options.StartLocation),
            }
        ];
        const closedListLocations = {};
        const reverseClosedListLocations = {};
        let surroundingBlocks = [];
        let reverseSurroundingBlocks = [];
        while (openList.length > 0 && reverseOpenList.length > 0) {
            if (Object.keys(closedListLocations).length >= this.Options.MaximumNodesToConsider ||
                Object.keys(reverseClosedListLocations).length >= this.Options.MaximumNodesToConsider) {
                this.ClearDebugBlocks();
                throw "Maximum number of nodes considered. MaximumNodesToConsider limit option hit.";
            }
            const nextIndex = this.GetIndexOfNodeWithLowestFCost(openList, this.Options.StartLocation, this.Options.GoalLocation);
            const nextNode = openList[nextIndex];
            const locationHash = Vec3.toString(nextNode.Block.location);
            const reverseNextIndex = this.GetIndexOfNodeWithLowestFCost(reverseOpenList, this.Options.GoalLocation, this.Options.StartLocation);
            const reverseNextNode = reverseOpenList[reverseNextIndex];
            const reverseLocationHash = Vec3.toString(reverseNextNode.Block.location);
            if (locationHash in reverseClosedListLocations || reverseLocationHash in closedListLocations) {
                let nodeList = [];
                let currentNode = nextNode;
                while (currentNode !== null) {
                    if (!this.GetIndexOfNodeIfInList(currentNode, nodeList))
                        nodeList.push(currentNode);
                    currentNode = currentNode.ParentNode;
                    yield;
                }
                nodeList = nodeList.reverse();
                currentNode = reverseNextNode;
                while (currentNode !== null) {
                    if (!this.GetIndexOfNodeIfInList(currentNode, nodeList))
                        nodeList.push(currentNode);
                    currentNode = currentNode.ParentNode;
                    yield;
                }
                return goalNodePromiseResolve(nodeList);
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
            surroundingBlocks = [];
            reverseOpenList.splice(reverseNextIndex, 1);
            reverseClosedListLocations[reverseLocationHash] = reverseNextNode;
            let reverseSurroundingLocations;
            if (!this.Options.AllowYAxisFlood) {
                reverseSurroundingLocations = CuboidRegion.FromCenterLocation(reverseNextNode.Block.location, 1, true).GetAllLocationsInRegion();
            }
            else {
                reverseSurroundingLocations = CuboidRegion.GetAdjacentPositions(reverseNextNode.Block.location, 1);
            }
            reverseSurroundingBlocks = [];
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
                        break;
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
                    FCost: this.CalculateFCost(surroundingBlock, this.Options.StartLocation, this.Options.GoalLocation),
                    GCost: nextNode.GCost + 1,
                    HCost: this.CalculateHHeuristic(surroundingBlock, this.Options.GoalLocation),
                };
                const surroundingBlockLocationHash = Vec3.toString(surroundingBlock.location);
                if (surroundingBlockLocationHash in closedListLocations) {
                    continue;
                }
                const IndexOfExistingNodeInReversedOpenList = this.GetIndexOfNodeIfInList(surroundingNode, reverseOpenList);
                if (IndexOfExistingNodeInReversedOpenList) {
                    const forwardSurroundingNode = surroundingNode;
                    let nodeList = [];
                    let currentNode = forwardSurroundingNode;
                    while (currentNode !== null) {
                        if (!this.GetIndexOfNodeIfInList(currentNode, nodeList))
                            nodeList.push(currentNode);
                        currentNode = currentNode.ParentNode;
                        yield;
                    }
                    nodeList = nodeList.reverse();
                    currentNode = reverseOpenList[IndexOfExistingNodeInReversedOpenList];
                    while (currentNode !== null) {
                        if (!this.GetIndexOfNodeIfInList(currentNode, nodeList))
                            nodeList.push(currentNode);
                        currentNode = currentNode.ParentNode;
                        yield;
                    }
                    nodeList = nodeList.reverse();
                    return goalNodePromiseResolve(nodeList);
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
            for (const location of reverseSurroundingLocations) {
                let blockAtLocation;
                try {
                    blockAtLocation = this.Options.Dimension.getBlock(location);
                }
                catch (e) { }
                if (blockAtLocation !== undefined && blockAtLocation.isValid()) {
                    if (Vec3.equals(location, this.Options.StartLocation)) {
                        reverseSurroundingBlocks.push(blockAtLocation);
                        break;
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
                                    reverseSurroundingBlocks.push(belowBlock);
                                }
                                if (topSafetyCheckResult.IsSafe) {
                                    reverseSurroundingBlocks.push(upBlock);
                                }
                                reverseSurroundingBlocks.push(blockAtLocation);
                                continue;
                            }
                            if (safetyCheckResult.CanSafelyFallFrom) {
                                reverseSurroundingBlocks.push(blockAtLocation.below(1));
                            }
                            else if (safetyCheckResult.CanSafelyJumpOnto) {
                                reverseSurroundingBlocks.push(blockAtLocation.above(1));
                            }
                            else {
                                reverseSurroundingBlocks.push(blockAtLocation);
                            }
                        }
                    }
                }
                yield;
            }
            for (const reverseSurroundingBlock of reverseSurroundingBlocks) {
                const reverseSurroundingNode = {
                    Block: reverseSurroundingBlock,
                    ParentNode: reverseNextNode,
                    FCost: this.CalculateFCost(reverseSurroundingBlock, this.Options.GoalLocation, this.Options.StartLocation),
                    GCost: reverseNextNode.GCost + 1,
                    HCost: this.CalculateHHeuristic(reverseSurroundingBlock, this.Options.StartLocation),
                };
                const reverseSurroundingBlockLocationHash = Vec3.toString(reverseSurroundingBlock.location);
                if (reverseSurroundingBlockLocationHash in reverseClosedListLocations) {
                    continue;
                }
                const reversedIndexOfExistingNodeInOpenList = this.GetIndexOfNodeIfInList(reverseSurroundingNode, openList);
                if (reversedIndexOfExistingNodeInOpenList) {
                    const forwardSurroundingNode = openList[reversedIndexOfExistingNodeInOpenList];
                    let nodeList = [];
                    let currentNode = forwardSurroundingNode;
                    while (currentNode !== null) {
                        if (!this.GetIndexOfNodeIfInList(currentNode, nodeList))
                            nodeList.push(currentNode);
                        currentNode = currentNode.ParentNode;
                        yield;
                    }
                    nodeList = nodeList.reverse();
                    currentNode = reverseSurroundingNode;
                    while (currentNode !== null) {
                        if (!this.GetIndexOfNodeIfInList(currentNode, nodeList))
                            nodeList.push(currentNode);
                        currentNode = currentNode.ParentNode;
                        yield;
                    }
                    nodeList = nodeList.reverse();
                    return goalNodePromiseResolve(nodeList);
                }
                this.SetDebugBlock(reverseSurroundingBlock);
                const reverseIndexOfExistingNodeInReversedOpenList = this.GetIndexOfNodeIfInList(reverseSurroundingNode, reverseOpenList);
                if (reverseIndexOfExistingNodeInReversedOpenList === null) {
                    reverseOpenList.push(reverseSurroundingNode);
                }
                else {
                    if (reverseOpenList[reverseIndexOfExistingNodeInReversedOpenList].GCost > reverseSurroundingNode.GCost) {
                        reverseOpenList[reverseIndexOfExistingNodeInReversedOpenList].GCost = reverseSurroundingNode.GCost;
                        reverseOpenList[reverseIndexOfExistingNodeInReversedOpenList].ParentNode = reverseSurroundingNode.ParentNode;
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
        system.run(() => this.Options.Dimension.setBlockType(block, MinecraftBlockTypes.StructureVoid));
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
    GetIndexOfNodeWithLowestFCost(listOfNodes, StartLocation, GoalLocation) {
        let currentLowestIndex = -1;
        let currentLowestFCost = -1;
        for (const index in listOfNodes) {
            let indexNumber = parseInt(index);
            if (currentLowestIndex === -1) {
                currentLowestFCost = this.CalculateFCost(listOfNodes[indexNumber].Block, StartLocation, GoalLocation);
                currentLowestIndex = indexNumber;
            }
            else {
                const thisFCost = this.CalculateFCost(listOfNodes[indexNumber].Block, StartLocation, GoalLocation);
                if (thisFCost < currentLowestFCost) {
                    currentLowestFCost = thisFCost;
                    currentLowestIndex = indexNumber;
                }
            }
        }
        return currentLowestIndex;
    }
    CalculateFCost(block, StartLocation, GoalLocation) {
        return this.CalculateGCost(block, StartLocation) + this.CalculateHHeuristic(block, GoalLocation);
    }
    CalculateGCost(block, StartLocation) {
        return Vec3.distance(block.location, StartLocation);
    }
    CalculateHHeuristic(block, GoalLocation) {
        return Vec3.distance(block.location, GoalLocation);
    }
}
