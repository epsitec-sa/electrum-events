import {Trace} from 'electrum-trace';
import {getTextSelection} from 'electrum-utils';

/******************************************************************************/

function getStates (target) {
  if (target && target.nodeName === 'INPUT') {
    return [ getTextSelection (target) ];
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


  handleClick (ev) {
    this.notify (ev, e => this.forwardDispatchEvent (e, 'action'));
    ev.stopPropagation ();
  }

  handleBlur (ev) {
    this.notify (ev, e => this.forwardNotifyEvent (e, 'defocus'));
    this.notify (ev, e => this.forwardDispatchEvent (e, 'defocus'));
    ev.stopPropagation ();
  }

  handleFocus (ev) {
    this.notify (ev, e => this.forwardNotifyEvent (e, 'focus'));
    this.notify (ev, e => this.forwardDispatchEvent (e, 'focus'));
    ev.stopPropagation ();
  }

  handleChange (ev) {
    this.notify (ev, e => this.forwardNotifyEvent (e, 'change'));
    ev.stopPropagation ();
    ev.preventDefault ();
  }

  handleKeyDown (ev) {
    this.notify (ev, e => this.forwardNotifyEvent (e, 'key-down'));
  }

  handleKeyUp (ev) {
    this.notify (ev, e => this.forwardNotifyEvent (e, 'key-up'));
  }

  handleKeyPress (ev) {
    this.notify (ev, e => this.forwardNotifyEvent (e, 'key-press'));
  }

  handleSelect (ev) {
    this.notify (ev, e => this.forwardNotifyEvent (e, 'select'));
  }

  static inject (obj, bus) {
    const eh = new EventHandlers (obj, bus);

    if (obj.getValue) {
      eh._valueGetter = target => obj.getValue (target);
    }
    if (obj.getStates) {
      eh._statesGetter = target => obj.getStates (target);
    }

    const existingOnBlur     = obj.onBlur;
    const existingOnFocus    = obj.onFocus;
    const existingOnChange   = obj.onChange;
    const existingOnKeyDown  = obj.onKeyDown;
    const existingOnKeyPress = obj.onKeyPress;
    const existingOnKeyUp    = obj.onKeyUp;
    const existingOnSelect   = obj.onSelect;
    const existingOnClick    = obj.onClick;

    obj.onBlur =
      e => {
        existingOnBlur && existingOnBlur.call (obj, e);
        eh.handleBlur (e);
      };

    obj.onFocus =
      e => {
        existingOnFocus && existingOnFocus.call (obj, e);
        eh.handleFocus (e);
      };

    obj.onClick =
      e => {
        existingOnClick && existingOnClick.call (obj, e);
        eh.handleClick (e);
      };

    obj.onChange =
      e => {
        existingOnChange && existingOnChange.call (obj, e);
        eh.handleChange (e);
      };

    obj.onKeyDown =
      e => {
        existingOnKeyDown && existingOnKeyDown.call (obj, e);
        eh.handleKeyDown (e);
      };

    obj.onKeyUp =
      e => {
        existingOnKeyUp && existingOnKeyUp.call (obj, e);
        eh.handleKeyUp (e);
      };

    obj.onKeyPress =
      e => {
        existingOnKeyPress && existingOnKeyPress.call (obj, e);
        eh.handleKeyPress (e);
      };

    obj.onSelect =
      e => {
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

  forwardNotifyEvent (event, type) {
    this.log (event, type);
    const bus = this.bus;
    if (bus && 'notify' in bus) {
      const target = event.target;
      bus.notify (this.props, {event, type}, this.getValue (target), ...this.getStates (target));
    }
  }

  forwardDispatchEvent (ev, source) {
    this.log (ev, source);
    const bus = this.bus;
    if (bus && 'dispatch' in bus) {
      bus.dispatch (this.props, source);
    }
  }

  log (ev, source) {
    if (this.debug) {
      if (typeof this._debug === 'function') {
        this._debug (this.component, source, ev);
      } else {
        Trace.log (`${source}: %O`, ev);
      }
    }
  }
}

/******************************************************************************/
