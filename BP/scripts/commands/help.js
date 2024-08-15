import { CommandHandler } from './command_handler';
import { ADDON_NAME } from 'constant';
const importCommand = async (player, commandName) => {
    try {
        const importedCommandModule = await import(`./${commandName}.js`);
        return importedCommandModule.default;
    }
    catch (error) {
        player.sendMessage(`§cError while fetching ${commandName} command: ${error.message}`);
        return null;
    }
};
const details = {
    __addonName__: ADDON_NAME,
    __name__: 'help',
    __description__: 'Displays the help message.',
    __format__: '[<commandName: string>?]',
};
const command = {
    name: details.__name__,
    description: details.__description__,
    format: details.__format__,
    usage() {
        return (`Format:
        > ${CommandHandler.prefix}${this.name} ${this.format}
        Usage:
        > ${CommandHandler.prefix}${this.name}
        > ${CommandHandler.prefix}${this.name} config
        `).replaceAll("        ", "");
    },
    async execute(player, args) {
        if (!args || args.length === 0) {
            let helpMessage = `\n§aCommands available @ ${details.__addonName__}: \n`;
            for (const commandName of CommandHandler.commands) {
                const importedCommand = await importCommand(player, commandName);
                if (importedCommand)
                    helpMessage += `§e${CommandHandler.prefix}${commandName}§r${importedCommand.format.length ? " " + importedCommand.format : ""} - ${importedCommand.description}\n`;
            }
            player.sendMessage(helpMessage);
        }
        else {
            const specifiedCommand = args[0].toLowerCase();
            if (!CommandHandler.commands.includes(specifiedCommand))
                return player.sendMessage(`§cInvalid command specified: ${specifiedCommand}`);
            if (CommandHandler.commands.includes(specifiedCommand)) {
                const importedCommand = await importCommand(player, specifiedCommand);
                if (importedCommand) {
                    player.sendMessage(`\n§e${CommandHandler.prefix}${specifiedCommand}: \n${importedCommand.description}§r ${importedCommand.usage()}`);
                }
            }
        }
    }
};
export default command;
