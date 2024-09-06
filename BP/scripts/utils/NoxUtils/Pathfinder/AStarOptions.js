export class AStarOptions {
    constructor(startLocation, goalLocation, dimension) {
        this.LocationsToIgnore = [];
        this.MaximumNodesToConsider = 100;
        this.TagsToIgnore = [];
        this.TypeIdsToIgnore = [];
        this.TagsToConsiderPassable = [];
        this.TypeIdsToConsiderPassable = [];
        this.TypeIdsThatCannotBeJumpedOver = [];
        this.AllowYAxisFlood = false;
        this.DebugMode = false;
        this.StartLocation = startLocation;
        this.GoalLocation = goalLocation;
        this.Dimension = dimension;
    }
}
