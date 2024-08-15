
import { 
  Entity,
  EntityItemComponent,
  EntityQueryOptions} from '@minecraft/server';
import { OverTakes } from "overrides/partial_overtakes";
import { getValidFamily } from 'utils/utilities';

type EntityClassificationType = "ITEM" | "ENTITY";


declare module "@minecraft/server" {
  interface Entity {
    StableIsOp(): boolean;
    toString(type: EntityClassificationType): string;
    get isFish(): boolean;
  }
}

OverTakes(Entity.prototype, {
  StableIsOp() {
    return true;
  },
  get isFish(): boolean {
    return getValidFamily().some(family => {
      const entityFilter: EntityQueryOptions = {
        families: [family],
        closest: 1,
        maxDistance: 1,
        location: this.location
      };
      return this.dimension.getEntities(entityFilter).length;
    });
  },
  toString(type: EntityClassificationType): string {
    let stringFormat = "";
    switch (type) {
      case "ITEM":
        const item = (this.getComponent(EntityItemComponent.componentId) as EntityItemComponent).itemStack;
        stringFormat = `Item(${item.nameTag}, ${item.amount}, ${item.typeId})`;
        break;
      case "ENTITY":
        stringFormat = `Item(${this.nameTag}, (${this.location.x}, ${this.location.y}, ${this.location.z}), ${this.typeId})`;
        break;
      default:
        stringFormat = `Item(${this.nameTag}, (${this.location.x}, ${this.location.y}, ${this.location.z}), ${this.typeId})`;
        break;
    }
    return stringFormat;
  },  
});