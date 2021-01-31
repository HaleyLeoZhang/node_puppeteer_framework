import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import {SENTRY_DSN} from "../../conf";

export default class SentryTool {
    static captureException(err) {
        if (SENTRY_DSN === "") {
            return
        }
        if (!this.sentry) {
            Sentry.init({
                dsn: SENTRY_DSN,
                tracesSampleRate: 1.0,
            });
            this.sentry = true
        }
        Sentry.captureException(err);
    }
}
