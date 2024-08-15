import { Dimension, Entity, Vector3 } from "@minecraft/server";

export class FishingHook  {
  private _source: Entity;
  private _isDeeplySubmerged: boolean = false;
  private _isSubmerged: boolean = false;
  constructor (other: Entity) {
    this.source = other;
  }
  public get dimension() {
    return this.source.dimension;
  }
  public get location() {
    return this.source.location;
  }
  public get source() {
    return this._source;
  }
  public set source(other: Entity) {
    this._source = other;
  }
  stablizedLocation: Vector3;
  public get isDeeplySubmerged(): boolean {
    return this._isDeeplySubmerged;
  }
  public set isDeeplySubmerged(args: boolean) {
    this._isDeeplySubmerged = args;
  }
  public get isSubmerged(): boolean {
    return this._isSubmerged;
  }
  public set isSubmerged(args: boolean) {
    this._isSubmerged = args;
  }
  isValid(): boolean {
    return this.source.isValid();
  }
  getProperty(identifier: string): boolean | number | string | undefined {
    return this.source.getProperty(identifier);
  }
  kill(): boolean {
    return this.source.kill();
  }
  getVelocity(): Vector3 {
    return this.source.getVelocity();
  }
}