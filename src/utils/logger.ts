interface GlobalLoggerOptions {
    enabled: boolean;
    level: keyof typeof logLevels;
    levels: typeof logLevels;
  }

  const globalContext : String = 'ServerLogger';
  
  const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  } as const;
  
  const globalLogger: GlobalLoggerOptions = {
    enabled: true, // Enable the global logger by default
    level: 'debug',
    levels: logLevels
  };
  
  class Logger {
    private name: string;
  
    constructor(name: string) {
      this.name = name;
    }
  
    log(level: keyof typeof logLevels, message: string): void {
      if (globalLogger.enabled && globalLogger.levels[level] >= globalLogger.levels[globalLogger.level]) {
        console.log(`${globalContext}: [${this.name}] ${message}`);
      }
    }
  
    info(message: string): void {
      this.log('debug', message);
    }
  
    // Other log methods like warn, error, debug can be added similarly
  }
  
  export { Logger, globalLogger, logLevels };