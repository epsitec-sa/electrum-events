/* global document */

/******************************************************************************/

export function preventGlobalMouseEvents () {
  document.body.style['pointer-events'] = 'none';
}

export function restoreGlobalMouseEvents () {
  document.body.style['pointer-events'] = 'auto';
}

/******************************************************************************/

const EventListenerMode = {capture: true};

class Capture {
  constructor (listeners) {
    this._listeners = listeners || {};
    this._mouseup   = e => this.mouseupListener (e);
    this._mousemove = e => this.mousemoveListener (e);
    document.addEventListener ('mouseup',   this._mouseup,   EventListenerMode);
    document.addEventListener ('mousemove', this._mousemove, EventListenerMode);
    preventGlobalMouseEvents ();
  }

  mousemoveListener (e) {
    e.stopPropagation ();
    if (this._listeners.onMouseMove) {
      this._listeners.onMouseMove (e);
    }
  }

  mouseupListener (e) {
    restoreGlobalMouseEvents ();
    if (this._listeners.onMouseUp) {
      this._listeners.onMouseUp (e);
    }
    document.removeEventListener ('mouseup',   this._mouseup,   EventListenerMode);
    document.removeEventListener ('mousemove', this._mousemove, EventListenerMode);
    e.stopPropagation ();
  }
}

/******************************************************************************/

export function captureMouseEvents (e, listeners) {
  const capture = new Capture (listeners);
  e.preventDefault ();
  e.stopPropagation ();
  return capture;
}

/******************************************************************************/
