
import {Logger} from 'tslog';

const logger = new Logger();

const UseLogger = () => logger;
/**
 * Exporting tslog to maintain the version.
 * Version: 3.3.1
 */
export {
    Logger,
    UseLogger
};