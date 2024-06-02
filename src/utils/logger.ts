interface GlobalLoggerOptions {
  enabled: boolean;
  level: keyof typeof logLevels;
  levels: typeof logLevels;
}

const globalContext: string = 'Identity-Recon';

const logLevels = {
  info: 2,
} as const;

 const globalLogger: GlobalLoggerOptions = {
  enabled: true, // Enable the global logger by default
  level: 'info',
  levels: logLevels
};

class Logger {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  log(level: keyof typeof logLevels, message: string): void {
    if (globalLogger.enabled) {
      console.log(`${globalContext}: [${this.name}] ${message}`);
    }
  }

  info(message: string): void {
    this.log('info', message);
  }

  error(message: string, error?: Error): void {
    this.log('info', `${message}${error ? `: ${error.message}` : ''}`);
  }
}

export { Logger, globalLogger, logLevels };