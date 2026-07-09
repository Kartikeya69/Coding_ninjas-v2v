type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const ctxString = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[Lumina AI] [${timestamp}] [${level.toUpperCase()}] ${message}${ctxString}`;
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (!this.isProduction) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    console.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>) {
    const errContext = error
      ? { ...context, error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined }
      : context;
    console.error(this.formatMessage('error', message, errContext));
  }
}

export const logger = new Logger();
export default logger;
