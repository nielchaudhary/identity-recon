"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logLevels = exports.globalLogger = exports.Logger = void 0;
const globalContext = 'ServerLogger';
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};
exports.logLevels = logLevels;
const globalLogger = {
    enabled: true, // Enable the global logger by default
    level: 'info',
    levels: logLevels
};
exports.globalLogger = globalLogger;
class Logger {
    constructor(name) {
        this.name = name;
    }
    log(level, message) {
        if (globalLogger.enabled && globalLogger.levels[level] >= globalLogger.levels[globalLogger.level]) {
            console.log(`${globalContext}: [${this.name}] ${message}`);
        }
    }
    info(message) {
        this.log('info', message);
    }
}
exports.Logger = Logger;
