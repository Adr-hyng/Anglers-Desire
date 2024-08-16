import { Player, world } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { db, ADDON_NAME } from "constant";
import { ICommandBase} from "./ICommandBase";
import { resetServerConfiguration } from "fishing_system";

enum REQUIRED_PARAMETER {
    SHOW = "show",
    RESET = "reset"
}

const command: ICommandBase = {
    name: 'database',
    description: 'Inspect or reset a database.',
    format: `[${Object.values(REQUIRED_PARAMETER).join('|')}]`,
    usage() {
        return (`
        Format:
        > ${CommandHandler.prefix}${this.name} ${this.format}
        Usage:
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.SHOW} = Display database content.
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.RESET} = Reset database content.
        `).replaceAll("        ", "");
    },
    execute(player, args) {
        if (args && args.length) {
            const requiredParams: string[] = (`[${Object.values(REQUIRED_PARAMETER).join('|')}]`).slice(1, -1).split('|').map(command => command.trim()); 
            const selectedReqParam: string = args[0].toLowerCase();
            const isShow: boolean = REQUIRED_PARAMETER.SHOW === selectedReqParam;
            if(!requiredParams.includes(selectedReqParam)) return player.sendMessage("§cInvalid Usage Format." + command.usage());
            if(isShow) {
                if(db.size === 0) {
                    player.sendMessage(`§4No configuration record found in database.§r`); 
                    return;
                }
                if(!player.StableIsOp()) return;
                let collections: string = "";
                let i = 1;
                for(const key of db.keys()) {
                    const t: string[] = (key as string).split("|");
                    const player: Player = world.getEntity(t[1]) as Player;
                    collections += `${i++}. ${player.nameTag}: ${t[2]}\n`;
                }
                player.sendMessage((`
                Database ID: §e${ADDON_NAME}§r
                ${collections}
                `).replaceAll("                ", ""));
            } else {
                player.sendMessage(`§aThe database has been reset.§r`);
                db.clear();
                if(!db.isDisposed) db.dispose();
            }
        }
    }
};

export default command