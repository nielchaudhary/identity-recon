"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logLevels = exports.globalLogger = exports.Logger = void 0;
const globalContext = 'Identity-Recon';
const logLevels = {
    info: 2,
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
        if (globalLogger.enabled) {
            console.log(`${globalContext}: [${this.name}] ${message}`);
        }
    }
    info(message) {
        this.log('info', message);
    }
    error(message, error) {
        this.log('info', `${message}${error ? `: ${error.message}` : ''}`);
    }
}
exports.Logger = Logger;
