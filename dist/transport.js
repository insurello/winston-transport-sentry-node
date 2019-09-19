"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Sentry = tslib_1.__importStar(require("@sentry/node"));
var winston_transport_1 = tslib_1.__importDefault(require("winston-transport"));
var SentryTransport = /** @class */ (function (_super) {
    tslib_1.__extends(SentryTransport, _super);
    function SentryTransport(opts) {
        var _this = _super.call(this, opts) || this;
        _this.silent = false;
        _this.levelsMap = {
            silly: Sentry.Severity.Debug,
            verbose: Sentry.Severity.Debug,
            info: Sentry.Severity.Info,
            debug: Sentry.Severity.Debug,
            warn: Sentry.Severity.Warning,
            error: Sentry.Severity.Error
        };
        _this.silent = opts && opts.silent || false;
        Sentry.init(_this.withDefaults(opts && opts.sentry || {}));
        return _this;
    }
    SentryTransport.prototype.log = function (info, callback) {
        var _this = this;
        setImmediate(function () {
            _this.emit('logged', info);
        });
        if (this.silent)
            return callback();
        var message = info.message, winstonLevel = info.level, tags = info.tags, meta = tslib_1.__rest(info, ["message", "level", "tags"]);
        var sentryLevel = this.levelsMap[winstonLevel];
        Sentry.configureScope(function (scope) {
            if (tags !== undefined && _this.isObject(tags)) {
                scope.setTags(tags);
            }
            scope.setExtras(meta);
            // TODO: add user details
            // scope.setUser({ id: '4711' }); // id, email, username, ip_address
            // TODO: add fingerprints
            // scope.setFingerprint(['{{ default }}', path]); // fingerprint should be an array
            // scope.clear();
        });
        // TODO: add breadcrumbs
        // Sentry.addBreadcrumb({
        //   message: 'My Breadcrumb',
        //   // ...
        // });
        // Capturing Errors / Exceptions
        if (this.shouldLogException(sentryLevel)) {
            Sentry.captureException(new Error(message));
            return callback();
        }
        // Capturing Messages
        Sentry.captureMessage(message, sentryLevel);
        return callback();
    };
    Object.defineProperty(SentryTransport.prototype, "sentry", {
        get: function () {
            return Sentry;
        },
        enumerable: true,
        configurable: true
    });
    SentryTransport.prototype.withDefaults = function (options) {
        return tslib_1.__assign({ dsn: options && options.dsn || process.env.SENTRY_DSN || '', serverName: options && options.serverName || 'winston-transport-sentry-node', environment: options && options.environment || process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'production', debug: options && options.debug || !!process.env.SENTRY_DEBUG || false, sampleRate: options && options.sampleRate || 1.0, maxBreadcrumbs: options && options.maxBreadcrumbs || 100 }, options);
    };
    // private normalizeMessage(msg: any) {
    //   return msg && msg.message ? msg.message : msg;
    // }
    SentryTransport.prototype.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };
    SentryTransport.prototype.shouldLogException = function (level) {
        return level === Sentry.Severity.Fatal || level === Sentry.Severity.Error;
    };
    return SentryTransport;
}(winston_transport_1.default));
exports.default = SentryTransport;
;
//# sourceMappingURL=transport.js.map