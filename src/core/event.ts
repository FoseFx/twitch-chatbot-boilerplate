import { EventEmitter } from 'events';

let _eventEmitter: EventEmitter;

export function setClientReadyEmitter(ee: EventEmitter): void {
  _eventEmitter = ee;
}

export function getClientReadyEmitter(): EventEmitter {
  return _eventEmitter;
}
