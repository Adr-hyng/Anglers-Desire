
import { 
  Entity,
  EntityItemComponent,
  EntityQueryOptions} from '@minecraft/server';
import { OverTakes } from "overrides/partial_overtakes";

type EntityClassificationType = "ITEM" | "ENTITY";


declare module "@minecraft/server" {
  interface Entity {
    toString(type: EntityClassificationType): string;
  }
}

OverTakes(Entity.prototype, {
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