'use strict';

export default class Event {
  constructor () {
    this._stopProp = 0;
    this._prevDef = 0;
  }
  get propagationStop () {
    return this._stopProp;
  }
  get defaultPrevention () {
    return this._prevDef;
  }
  stopPropagation () {
    this._stopProp++;
  }
  preventDefault () {
    this._prevDef++;
  }
}
