import { Entity, EntityItemComponent } from '@minecraft/server';
import { OverTakes } from "overrides/partial_overtakes";
OverTakes(Entity.prototype, {
    toString(type) {
        let stringFormat = "";
        switch (type) {
            case "ITEM":
                const item = this.getComponent(EntityItemComponent.componentId).itemStack;
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
