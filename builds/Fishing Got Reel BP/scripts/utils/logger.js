import { system } from "@minecraft/server";
import { SERVER_CONFIGURATION } from "fishing_system/index";
export var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (LogLevel = {}));
export class Logger {
    static setLogLevel(level) {
        Logger.level = level;
    }
    static log(level, ...message) {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.ERROR];
        const currentLevelIndex = levels.indexOf(Logger.level);
        const logLevelIndex = levels.indexOf(level);
        if (logLevelIndex >= currentLevelIndex && SERVER_CONFIGURATION.debug) {
            const timestamp = system.currentTick;
            const formattedMessage = `[${timestamp}] [${level}] - ${message}`;
            switch (level) {
                case LogLevel.DEBUG:
                    console.warn(formattedMessage);
                    break;
                case LogLevel.INFO:
                    console.log(formattedMessage);
                    break;
                case LogLevel.ERROR:
                    console.error(formattedMessage);
                    break;
            }
        }
    }
    static debug(...message) {
        if (SERVER_CONFIGURATION.debug)
            Logger.log(LogLevel.DEBUG, message);
    }
    static info(...message) {
        if (SERVER_CONFIGURATION.debug)
            Logger.log(LogLevel.INFO, message);
    }
    static error(...message) {
        if (SERVER_CONFIGURATION.debug)
            Logger.log(LogLevel.ERROR, message);
    }
}
Logger.level = SERVER_CONFIGURATION.debug ? LogLevel.DEBUG : LogLevel.INFO;
