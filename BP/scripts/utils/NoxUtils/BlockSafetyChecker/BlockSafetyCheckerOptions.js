export class BlockSafetyCheckerOptions {
    constructor() {
        this.EntityHeight = 2;
        this.AllowYAxisFlood = false;
        this.TypeIdsToConsiderPassable = [];
        this.TagsToConsiderPassable = [];
        this.TypeIdsThatCannotBeJumpedOver = [];
        this.TagIdsThatCannotBeJumpedOver = [];
    }
}
