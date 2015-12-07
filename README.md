# Electrum Events

[![NPM version](https://img.shields.io/npm/v/electrum-events.svg)](https://www.npmjs.com/package/electrum-events)
[![Build Status](https://travis-ci.org/epsitec-sa/electrum-events.svg?branch=master)](https://travis-ci.org/epsitec-sa/electrum-events)
[![Build status](https://ci.appveyor.com/api/projects/status/8c6nooep3fbnoytc?svg=true)](https://ci.appveyor.com/project/epsitec/electrum-events)

The `electrum-events` module forwards web component events to the bus.

The `EventHandlers` class provides implementations for the various event
handlers needed by React web components:

* `handleFocus`
* `handleChange`
* `handleKeyDown` and `handleKeyUp`
* `handleSelect`

Events are of two categories:

* Events which modify a value (change, key up/down, select).  
  They are sent with the `bus.notify()` function.
* Events which trigger an action (focus, button click).  
  They are sent with the `bus.dispatch()` function.
