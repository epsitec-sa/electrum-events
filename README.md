# Electrum Events

[![NPM version](https://img.shields.io/npm/v/electrum-events.svg)](https://www.npmjs.com/package/electrum-events)
[![Build Status](https://travis-ci.org/epsitec-sa/electrum-events.svg?branch=master)](https://travis-ci.org/epsitec-sa/electrum-events)
[![Build status](https://ci.appveyor.com/api/projects/status/8c6nooep3fbnoytc?svg=true)](https://ci.appveyor.com/project/epsitec/electrum-events)

The `electrum-events` module forwards web component events to the bus.

The `EventHandlers` class provides implementations for the various event
handlers needed by React web components:

* `handleFocus`
* `handleChange`
* `handleKeyDown`, `handleKeyUp` and `handleKeyPress`
* `handleSelect`

Events are of two categories:

* Events which modify a value (change, key up/down, select).  
  They are sent with the `bus.notify()` function.
* Events which trigger an action (focus, button click).  
  They are sent with the `bus.dispatch()` function.

# Debug with active logging

Class `EventHandlers` has a property `debug` which can be set to log
events to the console, which may prove convenient to better understand
what happens.

For customized logging, set `debug` to a function:

```javascript
const eh = new EventHandlers (obj, bus);
eh.debug = (source, event) => { /* ... */ };
```

The `source` argument will be one of `focus`, `change`, `key-down`,
`key-up`, `key-press` and `select`, while the `event` property gives
full access to the event being processed.
