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

    if (typeof bus === 'function') {
      this._busGetter = bus;
    } else {
      this._busGetter = () => bus;
    }
  }

  get props () {
    return this._obj.props;
  }

  get bus () {
    return this._busGetter (this.props);
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
      bus.notify (this.props, this._valueGetter (target), ...this._statesGetter (target));
    }
  }

  processFocusEvent () {
    const bus = this.bus;
    if (bus && 'dispatch' in bus) {
      bus.dispatch (this.props, 'focus');
    }
  }
}

/******************************************************************************/
