# Electrum Events

[![NPM version](https://img.shields.io/npm/v/electrum-events.svg)](https://www.npmjs.com/package/electrum-events)
[![Build Status](https://travis-ci.org/epsitec-sa/electrum-events.svg?branch=master)](https://travis-ci.org/epsitec-sa/electrum-events)
[![Build status](https://ci.appveyor.com/api/projects/status/0kuudrbhwiunp0k0?svg=true)](https://ci.appveyor.com/project/epsitec/electrum-events)

The `electrum-events` module forwards web component events to the bus.

# Mouse capture utilities

Capturing the mouse on Chrome (and electron) is [tricky](http://code.fitness/post/2016/06/capture-mouse-events.html).
`electrum-events` provides some helper functions to make the developer's
life easier:

* `captureMouseEvents(e, listeners)` captures the mouse until the mouse
  button gets released. The `listeners` object can specify functions
  `onMouseMove(e)` and `onMouseUp(e)` to process these events.  
* `preventGlobalMouseEvents()` and `restoreGlobalMouseEvents()` can be
  used to disable mouse events on a complete HTML document. This can come
  in handy if you want to make an HTML page passive.

Note that `captureMouseEvents()` makes use of `preventGlobalMouseEvents()`
so there is no need to call these functions when capturing the mouse events. 

# The EventHandlers class

The `EventHandlers` class provides implementations for the various event
handlers needed by React web components:

* `handleBlur` and `handleFocus`
* `handleChange`
* `handleKeyDown`, `handleKeyUp` and `handleKeyPress`
* `handleSelect`

Events are of two categories:

* Events which modify a value (change, key up/down, select).  
  They are sent with the `bus.notify()` function.
* Events which trigger an action (focus, defocus, button click).  
  They are sent with the `bus.dispatch()` function.

## Using EventHandlers

Usually, you won't use `EventHandlers` yourself. It is Electrum's
responsibility to _inject_ the handlers into wrapped components.
This is handled by Electrum's `InjectingMiddleware`:

```javascript
class Electrum {
  ...
  reset () {
    ...
    this._injectingMiddleware = new InjectingMiddleware ();
    this._injectingMiddleware.register ('events', obj => {
      obj._eventHandlers = EventHandlers.inject (obj, () => this.bus);
    });
    ...
  }
}
```

The instance of the event handlers class attached to a component
can be accessed through `obj._eventHandlers`. This might be useful
when debugging (see below).

## EventHandlers properties

Every event handlers instance provides the following public properties:

* `component` &rarr; the component to which the handlers are attached.
* `props` &rarr; the properties of the component.
* `bus` &rarr; the bus to which the events will be sent.

## Debug with active logging

Class `EventHandlers` has a property `debug` which can be set to log
events to the console, which may prove convenient to better understand
what happens.

For customized logging, set `debug` to a function:

```javascript
const eh = new EventHandlers (obj, bus);
eh.debug = (component, source, event) => { /* ... */ };
```

The `component` argument refers to the component on which the event
was notified. The `source` argument is one of `focus`, `change`,
`key-down`, `key-up`, `key-press` and `select`, while the `event`
argument gives full access to the event being processed.
