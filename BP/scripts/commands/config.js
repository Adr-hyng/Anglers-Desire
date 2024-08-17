import { system } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { overrideEverything } from "overrides/index";
overrideEverything();
var REQUIRED_PARAMETER;
(function (REQUIRED_PARAMETER) {
    REQUIRED_PARAMETER["SHOW"] = "show";
    REQUIRED_PARAMETER["RESET"] = "reset";
})(REQUIRED_PARAMETER || (REQUIRED_PARAMETER = {}));
var OPTIONAL_PARAMETER;
(function (OPTIONAL_PARAMETER) {
    OPTIONAL_PARAMETER["CLIENT"] = "client";
    OPTIONAL_PARAMETER["SERVER"] = "server";
})(OPTIONAL_PARAMETER || (OPTIONAL_PARAMETER = {}));
const command = {
    name: 'config',
    description: 'Show or reset configuration settings.',
    format: `[${Object.values(REQUIRED_PARAMETER).join('|')}] [<${Object.values(OPTIONAL_PARAMETER).join('|')}>?]`,
    usage() {
        return (`
        Format:
        > ${CommandHandler.prefix}${this.name} ${this.format}
        Usage:
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.SHOW} = Shows config
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.RESET} ${OPTIONAL_PARAMETER.CLIENT} = Reset caller client config
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.RESET} ${OPTIONAL_PARAMETER.SERVER} = Reset world server config (Admin)
        `).replaceAll("        ", "");
    },
    async execute(player, args) {
        if (args && args.length) {
            const requiredParams = (`[${Object.values(REQUIRED_PARAMETER).join('|')}]`).slice(1, -1).split('|').map(command => command.trim());
            const selectedReqParam = args[0].toLowerCase();
            const isShow = REQUIRED_PARAMETER.SHOW === selectedReqParam;
            if (!requiredParams.includes(selectedReqParam))
                return player.sendMessage("§cInvalid Usage Format." + command.usage());
            if (isShow) {
                player.sendMessage(`Configuration: Please close chat screen immediately to open configuration.`);
                system.run(() => player.Configuration.showMainScreen());
            }
            else {
                const optionalParams = (`[${Object.values(OPTIONAL_PARAMETER).join('|')}]`).slice(1, -1).split('|').map(command => command.trim());
                const selectedOptParam = args[1]?.toLowerCase();
                let shouldResetClient = OPTIONAL_PARAMETER.CLIENT === selectedOptParam;
                if (!optionalParams.includes(selectedOptParam))
                    shouldResetClient = true;
                if (shouldResetClient)
                    player.Configuration.reset("CLIENT");
            }
        }
    }
};
export default command;
