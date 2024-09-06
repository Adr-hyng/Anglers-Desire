import { BlockSafetyCheckResult } from "./BlockSafetyCheckResult";
export class BlockSafetyCheckerUtility {
    static RunBlockSafetyCheck(block, options) {
        if (options.AllowYAxisFlood) {
            const result = new BlockSafetyCheckResult();
            result.IsSafe = BlockSafetyCheckerUtility.IsPassable(block, options);
            return result;
        }
        if (BlockSafetyCheckerUtility.IsPassable(block, options)) {
            let blockBelow;
            try {
                blockBelow = block.below(1);
            }
            catch (e) { }
            if (blockBelow !== undefined) {
                if (BlockSafetyCheckerUtility.IsPassable(blockBelow, options)) {
                    let blockFurtherBelow;
                    try {
                        blockFurtherBelow = block.below(2);
                    }
                    catch (e) { }
                    if (blockFurtherBelow !== undefined) {
                        if (BlockSafetyCheckerUtility.IsPassable(blockFurtherBelow, options)) {
                            const result = new BlockSafetyCheckResult();
                            result.IsSafe = false;
                            result.IsPossibleCliff = true;
                            return result;
                        }
                        else {
                            const result = new BlockSafetyCheckResult();
                            if (BlockSafetyCheckerUtility.IsLava(blockFurtherBelow, options)) {
                                result.IsSafe = false;
                                result.HasLavaBelow = true;
                                return result;
                            }
                            if (BlockSafetyCheckerUtility.IsWater(blockFurtherBelow, options)) {
                                result.IsSafe = false;
                                result.HasWaterBelow = false;
                                return result;
                            }
                            result.IsSafe = true;
                            result.CanSafelyFallFrom = true;
                            return result;
                        }
                    }
                    else {
                        const result = new BlockSafetyCheckResult();
                        result.IsSafe = false;
                        result.AdjacentBlockIsInUnloadedChunk = true;
                        return result;
                    }
                }
                else {
                    const result = new BlockSafetyCheckResult();
                    if (BlockSafetyCheckerUtility.IsLava(blockBelow, options)) {
                        result.IsSafe = false;
                        result.HasLavaBelow = true;
                        return result;
                    }
                    if (BlockSafetyCheckerUtility.IsWater(blockBelow, options)) {
                        result.IsSafe = false;
                        result.HasWaterBelow = false;
                        return result;
                    }
                    for (let i = 0; i < options.EntityHeight - 1; i++) {
                        let blockToCheck;
                        try {
                            blockToCheck = block.above(i + 1);
                        }
                        catch (e) { }
                        if (blockToCheck !== undefined) {
                            if (!BlockSafetyCheckerUtility.IsPassable(blockToCheck, options)) {
                                const result = new BlockSafetyCheckResult();
                                result.IsSafe = false;
                                result.NotEnoughSpaceAboveBlockToWalkTo = true;
                                return result;
                            }
                        }
                        else {
                            result.IsSafe = false;
                            result.AdjacentBlockIsInUnloadedChunk = true;
                            return result;
                        }
                    }
                    result.IsSafe = true;
                    return result;
                }
            }
            else {
                const result = new BlockSafetyCheckResult();
                result.IsSafe = false;
                result.AdjacentBlockIsInUnloadedChunk = true;
                return result;
            }
        }
        else {
            if (!BlockSafetyCheckerUtility.CanBeJumpedOver(block, options)) {
                const result = new BlockSafetyCheckResult();
                result.IsSafe = false;
                result.CannotBeJumpedOver = true;
                return result;
            }
            for (let i = 0; i < options.EntityHeight; i++) {
                let blockToCheck;
                try {
                    blockToCheck = block.above(i + 1);
                }
                catch (e) { }
                if (blockToCheck !== undefined) {
                    if (!BlockSafetyCheckerUtility.IsPassable(blockToCheck, options)) {
                        const result = new BlockSafetyCheckResult();
                        result.IsSafe = false;
                        result.NotEnoughSpaceAboveBlockToJumpTo = true;
                        return result;
                    }
                }
                else {
                    const result = new BlockSafetyCheckResult();
                    result.IsSafe = false;
                    result.AdjacentBlockIsInUnloadedChunk = true;
                    return result;
                }
            }
            const result = new BlockSafetyCheckResult();
            result.IsSafe = true;
            result.CanSafelyJumpOnto = true;
            return result;
        }
    }
    static IsPassable(block, options) {
        if (!block.isValid()) {
            return false;
        }
        if (options.TypeIdsToConsiderPassable !== undefined && options.TypeIdsToConsiderPassable.indexOf(block.typeId) > -1) {
            return true;
        }
        if (options.TagsToConsiderPassable !== undefined) {
            const blockTags = block.getTags();
            const tagIdFound = options.TagsToConsiderPassable.some(tagId => blockTags.indexOf(tagId) > -1);
            if (tagIdFound) {
                return true;
            }
        }
        return false;
    }
    static CanBeJumpedOver(block, options) {
        if (options.TypeIdsThatCannotBeJumpedOver !== undefined && options.TypeIdsThatCannotBeJumpedOver.indexOf(block.typeId) > -1) {
            return false;
        }
        if (options.TagIdsThatCannotBeJumpedOver !== undefined) {
            const blockTags = block.getTags();
            const tagIdFound = options.TagIdsThatCannotBeJumpedOver.some(tagId => blockTags.indexOf(tagId) > -1);
            if (tagIdFound) {
                return false;
            }
        }
        return true;
    }
    static IsLava(block, options) {
        return block.typeId === "minecraft:lava" && !options.TypeIdsToConsiderPassable.includes(block.typeId);
    }
    static IsWater(block, options) {
        return block.typeId === "minecraft:water" && !options.TypeIdsToConsiderPassable.includes(block.typeId);
    }
}
