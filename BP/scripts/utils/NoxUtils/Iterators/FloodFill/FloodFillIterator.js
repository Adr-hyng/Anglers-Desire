import { Queue } from "../../DataStructures/Queue.js";
import { Vec3 } from "utils/Vector/VectorUtils.js";
import { BlockSafetyCheckerUtility } from "../../BlockSafetyChecker/BlockSafetyCheckerUtility.js";
import { BlockSafetyCheckerOptions } from "../../BlockSafetyChecker/BlockSafetyCheckerOptions.js";
export class FloodFillIterator {
    constructor(options) {
        this.Queue = new Queue();
        this.YieldedChunkSize = 8;
        this.ClosedList = {};
        this.Options = options;
        let startingBlock;
        try {
            startingBlock = options.Dimension.getBlock(options.StartLocation);
        }
        catch (e) {
            throw "Could not use starting block. It is invalid.";
        }
        if (startingBlock === undefined) {
            throw "Could not use starting block. It is undefined.";
        }
        for (const location of this.Options.LocationsToIgnore) {
            this.AddLocationToClosedList(location);
        }
        const safetyCheckOptions = new BlockSafetyCheckerOptions();
        safetyCheckOptions.TagsToConsiderPassable = this.Options.TagsToConsiderPassable;
        safetyCheckOptions.TypeIdsToConsiderPassable = this.Options.TypeIdsToConsiderPassable;
        safetyCheckOptions.TypeIdsThatCannotBeJumpedOver = this.Options.TypeIdsThatCannotBeJumpedOver;
        this.BlockSafetyCheckOptions = safetyCheckOptions;
        for (const block of this.IterateAdjacentPassableBlocks(startingBlock)) {
            if (block !== null) {
                this.Queue.Enqueue(block);
            }
        }
    }
    HasBlockLocationBeenClosed(block) {
        return Vec3.toString(block.location) in this.ClosedList;
    }
    HasLocationBeenClosed(location) {
        return Vec3.toString(location) in this.ClosedList;
    }
    AddLocationToClosedList(location) {
        this.ClosedList[Vec3.toString(location)] = true;
    }
    IsBlockIgnored(block) {
        if (block.isValid()) {
            if (this.Options.TagsToIgnore.length > 0) {
                const anyTagIsIgnored = block.getTags().some(tag => this.Options.TagsToIgnore.indexOf(tag) > -1);
                if (anyTagIsIgnored) {
                    return true;
                }
            }
            if (this.Options.TypeIdsToIgnore.indexOf(block.typeId) > -1) {
                return true;
            }
        }
        return false;
    }
    IsBlockPassable(block) {
        if (block.isValid()) {
            if (this.Options.TypeIdsToConsiderPassable.indexOf(block.typeId) > -1) {
                return true;
            }
            if (this.Options.TagsToConsiderPassable.length > 0) {
                const blockTags = block.getTags();
                const anyTagsArePassable = this.Options.TagsToConsiderPassable.some(tag => blockTags.indexOf(tag) > -1);
                if (anyTagsArePassable) {
                    return true;
                }
            }
        }
        return false;
    }
    IsBlockAlwaysIncluded(block) {
        if (block.isValid()) {
            if (this.Options.TypeIdsToAlwaysIncludeInResult.indexOf(block.typeId) > -1) {
                return true;
            }
            if (this.Options.TagsToAlwaysIncludeInResult.length > 0) {
                const blockTags = block.getTags();
                const anyTagsAreIncluded = this.Options.TagsToAlwaysIncludeInResult.some(tag => blockTags.indexOf(tag) > -1);
                if (anyTagsAreIncluded) {
                    return true;
                }
            }
        }
        return false;
    }
    IsLocationOutOfBounds(location) {
        return this.Options.StartLocation.distance(location) > this.Options.MaxDistance;
    }
    GetBlockIfPassable(block) {
        if (block.isValid()) {
            if (this.IsBlockPassable(block)) {
                if (!this.HasBlockLocationBeenClosed(block)) {
                    return block;
                }
            }
        }
        return null;
    }
    SetYieldedChunkSize(size) {
        this.YieldedChunkSize = size;
    }
    *IterateAdjacentPassableBlocks(fromBlock) {
        const fromBlockLocation = fromBlock.location;
        const adjacentPositions = [
            { x: fromBlockLocation.x + 1, y: fromBlockLocation.y, z: fromBlockLocation.z },
            { x: fromBlockLocation.x + 1, y: fromBlockLocation.y, z: fromBlockLocation.z + 1 },
            { x: fromBlockLocation.x + 1, y: fromBlockLocation.y, z: fromBlockLocation.z - 1 },
            { x: fromBlockLocation.x, y: fromBlockLocation.y, z: fromBlockLocation.z + 1 },
            { x: fromBlockLocation.x, y: fromBlockLocation.y, z: fromBlockLocation.z - 2 },
            { x: fromBlockLocation.x - 1, y: fromBlockLocation.y, z: fromBlockLocation.z },
            { x: fromBlockLocation.x - 1, y: fromBlockLocation.y, z: fromBlockLocation.z + 1 },
            { x: fromBlockLocation.x - 1, y: fromBlockLocation.y, z: fromBlockLocation.z - 1 },
        ];
        if (this.Options.AllowYAxisFlood) {
            adjacentPositions.push({ x: fromBlockLocation.x, y: fromBlockLocation.y + 1, z: fromBlockLocation.z });
            const newPositionsToAdd = [];
            for (let position of adjacentPositions) {
                const _position = new Vec3(position);
                newPositionsToAdd.push(_position.add(Vec3.up));
                newPositionsToAdd.push(_position.add(Vec3.down));
            }
            adjacentPositions.push(...newPositionsToAdd);
        }
        for (const location of adjacentPositions) {
            if (this.IsLocationOutOfBounds(location)) {
                continue;
            }
            if (this.HasLocationBeenClosed(location)) {
                continue;
            }
            let block;
            try {
                block = this.Options.Dimension.getBlock(location);
            }
            catch (e) { }
            if (block !== undefined) {
                if (block.isValid()) {
                    yield null;
                    if (this.IsBlockIgnored(block)) {
                        this.AddLocationToClosedList(location);
                        continue;
                    }
                    if (this.IsBlockAlwaysIncluded(block)) {
                        this.AddLocationToClosedList(block.location);
                        yield block;
                    }
                    else {
                        let availableBlock = null;
                        if (this.Options.AllowYAxisFlood) {
                            availableBlock = this.GetBlockIfPassable(block);
                        }
                        else {
                            const blockSafetyCheckResult = BlockSafetyCheckerUtility.RunBlockSafetyCheck(block, this.BlockSafetyCheckOptions);
                            yield null;
                            if (blockSafetyCheckResult.IsSafe) {
                                if (blockSafetyCheckResult.CanSafelyFallFrom) {
                                    const blockBelow = block.below(1);
                                    if (!this.HasBlockLocationBeenClosed(blockBelow)) {
                                        availableBlock = blockBelow;
                                    }
                                }
                                else if (blockSafetyCheckResult.CanSafelyJumpOnto) {
                                    const blockAbove = block.above(1);
                                    if (!this.HasBlockLocationBeenClosed(blockAbove)) {
                                        availableBlock = block.above(1);
                                    }
                                }
                                else {
                                    availableBlock = block;
                                }
                            }
                        }
                        if (availableBlock !== null) {
                            this.AddLocationToClosedList(availableBlock.location);
                            yield availableBlock;
                        }
                        else {
                            yield null;
                        }
                    }
                }
                else {
                    yield null;
                }
            }
            else {
                yield null;
            }
        }
    }
    *IterateLocations() {
        while (!this.Queue.IsEmpty) {
            const blocks = this.Queue.DequeueChunk(this.YieldedChunkSize);
            for (const block of blocks) {
                if (block.isValid()) {
                    const adjacentBlocks = [];
                    for (const iteratedBlock of this.IterateAdjacentPassableBlocks(block)) {
                        if (iteratedBlock !== null) {
                            adjacentBlocks.push(iteratedBlock);
                        }
                        yield null;
                    }
                    this.Queue.EnqueueList(adjacentBlocks);
                    yield block;
                }
                else {
                    yield null;
                }
            }
            yield null;
        }
    }
}
