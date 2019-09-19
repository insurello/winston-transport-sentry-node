import * as Sentry from '@sentry/node';
import TransportStream from 'winston-transport';
interface Info {
    message: string;
    level: string;
    tags?: {
        [key: string]: any;
    };
    [key: string]: any;
}
export interface SentryTransportOptions extends TransportStream.TransportStreamOptions {
    sentry?: Sentry.NodeOptions;
}
export default class SentryTransport extends TransportStream {
    silent: boolean;
    private levelsMap;
    constructor(opts?: SentryTransportOptions);
    log(info: Info, callback: () => void): void;
    readonly sentry: typeof Sentry;
    private withDefaults;
    private isObject;
    private shouldLogException;
}
export {};
