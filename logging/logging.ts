import {
    currentConfig,
    getPrintFn,
    LogLevel,
    withConfigProvideLogFn,
} from "./generic-logger";

export function logFn(
    catPrefix: string,
): (catSuffix: string, logLevel: LogLevel, ...addlParams: unknown[]) => void {
    const envConfigStr = process.env.NEXT_PUBLIC_YBJ_LOGGING_CONFIG;
    return withConfigProvideLogFn(
        currentConfig(envConfigStr),
        getPrintFn,
    )(catPrefix);
}
