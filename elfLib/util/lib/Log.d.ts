export declare enum LogLevel {
    log = 0,
    trace = 1,
    debug = 2,
    info = 3,
    warn = 4,
    error = 5,
    fatal = 6
}
export declare class Log {
    private static logger;
    static readonly l: (...args: any[]) => import("tracer").Tracer.LogOutput;
    static readonly i: (...args: any[]) => import("tracer").Tracer.LogOutput;
    static readonly d: (...args: any[]) => import("tracer").Tracer.LogOutput;
    static readonly w: (...args: any[]) => import("tracer").Tracer.LogOutput;
    static readonly e: (...args: any[]) => import("tracer").Tracer.LogOutput;
    static setLogPath(logPath: string, level: LogLevel): void;
}
