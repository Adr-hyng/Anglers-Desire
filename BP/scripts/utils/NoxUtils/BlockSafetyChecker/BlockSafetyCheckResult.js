export class BlockSafetyCheckResult {
    constructor() {
        this.IsSafe = false;
        this.CanSafelyFallFrom = false;
        this.CanSafelyJumpOnto = false;
        this.IsPossibleCliff = false;
        this.IsWater = false;
        this.IsLava = false;
        this.HasWaterBelow = false;
        this.HasLavaBelow = false;
        this.NotEnoughSpaceAboveBlockToWalkTo = false;
        this.NotEnoughSpaceAboveBlockToJumpTo = false;
        this.CannotBeJumpedOver = false;
        this.AdjacentBlockIsInUnloadedChunk = false;
    }
}
