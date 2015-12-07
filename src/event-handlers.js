'use strict';

import getTextSelection from 'electrum-utils/src/get-text-selection.js';

/******************************************************************************/

export default class EventHandlers {
  constructor (props, bus) {
    this._props = props;
    if (typeof bus === 'function') {
      this._busGetter = bus;
    } else {
      this._busGetter = () => bus;
    }
  }

  get props () {
    return this._props;
  }

  get bus () {
    return this._busGetter (this._props);
  }

  handleFocus (ev) {
    this.notify (ev, e => this.processChangeEvent (e));
    this.notify (ev, e => this.processFocusEvent (e));
    ev.stopPropagation ();
  }

  handleChange (ev) {
    this.notify (ev, e => this.processChangeEvent (e));
    ev.stopPropagation ();
    ev.preventDefault ();
  }

  handleKeyDown (ev) {
    this.notify (ev, e => this.processChangeEvent (e));
  }

  handleKeyUp (ev) {
    this.notify (ev, e => this.processChangeEvent (e));
  }

  handleSelect (ev) {
    this.notify (ev, e => this.processChangeEvent (e));
  }

/* private methods */

  notify (ev, handler) {
    if (ev.hasOwnProperty ('target')) {
      handler (ev);
    }
  }

  processChangeEvent (ev) {
    const bus = this.bus;
    if (bus && 'notify' in bus) {
      const target = ev.target;
      const states = getTextSelection (target);
      bus.notify (this._props, target.value, states);
    }
  }

  processFocusEvent () {
    const bus = this.bus;
    if (bus && 'dispatch' in bus) {
      bus.dispatch (this._props, 'focus');
    }
  }
}

/******************************************************************************/
