import { EventAggregator } from '../event';

const eventAggregator: EventAggregator = new EventAggregator();

/**
 * Returns the singleton EventAggregator object.
 * This should be used to Get and Publish events.
 * @returns EventAggregator
 */
export const UseEventAggregator = (): EventAggregator => eventAggregator;