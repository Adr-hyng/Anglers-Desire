export class FloodFillIteratorOptions {
    constructor(startLocation, dimension, maxDistance) {
        this.LocationsToIgnore = [];
        this.TagsToIgnore = [];
        this.TypeIdsToIgnore = [];
        this.TagsToConsiderPassable = [];
        this.TypeIdsToConsiderPassable = [];
        this.TypeIdsToAlwaysIncludeInResult = [];
        this.TagsToAlwaysIncludeInResult = [];
        this.TypeIdsThatCannotBeJumpedOver = [];
        this.AllowYAxisFlood = false;
        this.StartLocation = startLocation;
        this.Dimension = dimension;
        this.MaxDistance = maxDistance;
    }
}
