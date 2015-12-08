'use strict';

import getTextSelection from 'electrum-utils/src/get-text-selection.js';

/******************************************************************************/

export default class EventHandlers {
  constructor (props, bus, valueGetter) {
    this._props = props;
    if (typeof bus === 'function') {
      this._busGetter = bus;
    } else {
      this._busGetter = () => bus;
    }
    this._valueGetter = valueGetter || (target => target.value);
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

  handleKeyPress (ev) {
    this.notify (ev, e => this.processChangeEvent (e));
  }

  handleSelect (ev) {
    this.notify (ev, e => this.processChangeEvent (e));
  }

  static inject (obj, props, bus) {
    const eh = new EventHandlers (props, bus, obj.getValue && (target => obj.getValue (target)));
    /* jshint expr: true */
    const existingOnFocus    = obj.onFocus;
    const existingOnChange   = obj.onChange;
    const existingOnKeyDown  = obj.onKeyDown;
    const existingOnKeyPress = obj.onKeyPress;
    const existingOnKeyUp    = obj.onKeyUp;
    const existingOnSelect   = obj.onSelect;

    obj.onFocus = e => {
      existingOnFocus && existingOnFocus.call (obj, e);
      eh.handleFocus (e);
    };
    obj.onChange = e => {
      existingOnChange && existingOnChange.call (obj, e);
      eh.handleChange (e);
    };
    obj.onKeyDown = e => {
      existingOnKeyDown && existingOnKeyDown.call (obj, e);
      eh.handleKeyDown (e);
    };
    obj.onKeyUp = e => {
      existingOnKeyUp && existingOnKeyUp.call (obj, e);
      eh.handleKeyUp (e);
    };
    obj.onKeyPress = e => {
      existingOnKeyPress && existingOnKeyPress.call (obj, e);
      eh.handleKeyPress (e);
    };
    obj.onSelect = e => {
      existingOnSelect && existingOnSelect.call (obj, e);
      eh.handleSelect (e);
    };
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
      bus.notify (this._props, this._valueGetter (target), states);
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
