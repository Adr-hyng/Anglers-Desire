export class FishingHook {
    constructor(other) {
        this._isDeeplySubmerged = false;
        this._isSubmerged = false;
        this.source = other;
    }
    get dimension() {
        return this.source.dimension;
    }
    get location() {
        return this.source.location;
    }
    get source() {
        return this._source;
    }
    set source(other) {
        this._source = other;
    }
    get isDeeplySubmerged() {
        return this._isDeeplySubmerged;
    }
    set isDeeplySubmerged(args) {
        this._isDeeplySubmerged = args;
    }
    get isSubmerged() {
        return this._isSubmerged;
    }
    set isSubmerged(args) {
        this._isSubmerged = args;
    }
    isValid() {
        return this.source.isValid();
    }
    getProperty(identifier) {
        return this.source.getProperty(identifier);
    }
    kill() {
        return this.source.kill();
    }
    getVelocity() {
        return this.source.getVelocity();
    }
}
