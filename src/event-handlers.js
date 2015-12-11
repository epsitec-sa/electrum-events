'use strict';

import getTextSelection from 'electrum-utils/src/get-text-selection.js';

/******************************************************************************/

function getStates (target) {
  if (target && target.nodeName === 'INPUT') {
    return [getTextSelection (target)];
  } else {
    return [];
  }
}

/******************************************************************************/

export default class EventHandlers {
  constructor (obj, bus) {
    this._obj = obj;
    this._valueGetter  = target => target.value;
    this._statesGetter = target => getStates (target);
    this._obj._eventHandlers = this;

    if (typeof bus === 'function') {
      this._busGetter = bus;
    } else {
      this._busGetter = () => bus;
    }
  }

  get component () {
    return this._obj;
  }

  get props () {
    return this._obj.props;
  }

  get bus () {
    return this._busGetter (this.props);
  }

  get debug () {
    return !!this._debug;
  }

  set debug (value) {
    this._debug = value;
  }

  getValue (target) {
    return this._valueGetter (target);
  }

  getStates (target) {
    return this._statesGetter (target);
  }

  handleFocus (ev) {
    this.notify (ev, e => this.processChangeEvent (e, 'focus'));
    this.notify (ev, e => this.processFocusEvent (e, 'focus'));
    ev.stopPropagation ();
  }

  handleChange (ev) {
    this.notify (ev, e => this.processChangeEvent (e, 'change'));
    ev.stopPropagation ();
    ev.preventDefault ();
  }

  handleKeyDown (ev) {
    this.notify (ev, e => this.processChangeEvent (e, 'key-down'));
  }

  handleKeyUp (ev) {
    this.notify (ev, e => this.processChangeEvent (e, 'key-up'));
  }

  handleKeyPress (ev) {
    this.notify (ev, e => this.processChangeEvent (e, 'key-press'));
  }

  handleSelect (ev) {
    this.notify (ev, e => this.processChangeEvent (e, 'select'));
  }

  static inject (obj, bus) {
    const eh = new EventHandlers (obj, bus);

    if (obj.getValue) {
      eh._valueGetter = target => obj.getValue (target);
    }
    if (obj.getStates) {
      eh._statesGetter = target => obj.getStates (target);
    }

    const existingOnFocus    = obj.onFocus;
    const existingOnChange   = obj.onChange;
    const existingOnKeyDown  = obj.onKeyDown;
    const existingOnKeyPress = obj.onKeyPress;
    const existingOnKeyUp    = obj.onKeyUp;
    const existingOnSelect   = obj.onSelect;

    obj.onFocus = e => {  /* jshint expr: true */
      existingOnFocus && existingOnFocus.call (obj, e);
      eh.handleFocus (e);
    };
    obj.onChange = e => {  /* jshint expr: true */
      existingOnChange && existingOnChange.call (obj, e);
      eh.handleChange (e);
    };
    obj.onKeyDown = e => {  /* jshint expr: true */
      existingOnKeyDown && existingOnKeyDown.call (obj, e);
      eh.handleKeyDown (e);
    };
    obj.onKeyUp = e => {  /* jshint expr: true */
      existingOnKeyUp && existingOnKeyUp.call (obj, e);
      eh.handleKeyUp (e);
    };
    obj.onKeyPress = e => {  /* jshint expr: true */
      existingOnKeyPress && existingOnKeyPress.call (obj, e);
      eh.handleKeyPress (e);
    };
    obj.onSelect = e => {  /* jshint expr: true */
      existingOnSelect && existingOnSelect.call (obj, e);
      eh.handleSelect (e);
    };

    return eh;
  }

/* private methods */

  notify (ev, handler) {
    if (ev.hasOwnProperty ('target')) {
      handler (ev);
    }
  }

  processChangeEvent (ev, source) {
    this.log (ev, source);
    const bus = this.bus;
    if (bus && 'notify' in bus) {
      const target = ev.target;
      bus.notify (this.props, this.getValue (target), ...this.getStates (target));
    }
  }

  processFocusEvent (ev, source) {
    this.log (ev, source);
    const bus = this.bus;
    if (bus && 'dispatch' in bus) {
      bus.dispatch (this.props, 'focus');
    }
  }

  log (ev, source) {
    if (this.debug) {
      if (typeof this._debug === 'function') {
        this._debug (this.component, source, ev);
      } else {
        console.log (`${source}: %O`, ev);
      }
    }
  }
}

/******************************************************************************/
