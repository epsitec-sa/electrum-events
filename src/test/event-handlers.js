'use strict';

import {expect} from 'mai-chai';

import EventHandlers from '../event-handlers.js';
import Bus from './dummy-bus.js';
import Event from './dummy-event.js';

/******************************************************************************/

const emptyProps = {};
const emptyBus = {};
const emptyObj = {props: emptyProps};

describe ('EventHandlers', () => {
  describe ('constructor()', () => {
    it ('creates an instance', () => {
      const eh = new EventHandlers (emptyObj);
      expect (eh).to.exist ();
      expect (eh).to.have.property ('props', emptyProps);
      expect (eh).to.have.property ('bus', undefined);
      expect (eh).to.have.property ('component', emptyObj);
    });

    it ('attaches EventHandlers to component', () => {
      delete emptyObj._eventHandlers;
      expect (emptyObj._eventHandlers).to.be.undefined ();
      const eh = new EventHandlers (emptyObj);
      expect (emptyObj._eventHandlers).to.equal (eh);
    });
  });

  describe ('bus', () => {
    it ('calls bus call-back', () => {
      let busCalled = 0;
      const eh = new EventHandlers (emptyObj, () => (busCalled++, emptyBus));
      expect (busCalled).to.equal (0);
      expect (eh).to.have.property ('bus', emptyBus);
      expect (busCalled).to.equal (1);
    });
  });

  describe ('handleFocus()', () => {
    it ('does not invoke bus.notify() and bus.dispatch() when event has no target', () => {
      const bus = new Bus ();
      const eh = new EventHandlers (emptyObj, bus);
      const ev = new Event ();
      eh.handleFocus (ev);
      expect (bus).to.have.property ('_count', 0);
    });

    it ('invokes bus.notify() and bus.dispatch()', () => {
      const bus = new Bus ();
      const eh = new EventHandlers (emptyObj, bus);
      const ev = new Event ();
      ev.target = {value: 'x', nodeName: 'INPUT', nodeType: 1};
      eh.handleFocus (ev);
      expect (bus).to.have.property ('_count', 2);
      expect (bus).to.have.property ('_props', emptyProps);
      expect (bus).to.have.property ('_value', 'x');
      expect (bus).to.have.property ('_states').deep.equal ([{from: 0, to: 0}]);
      expect (bus).to.have.property ('_message', 'focus');
    });

    it ('stops event propagation', () => {
      const bus = new Bus ();
      const eh = new EventHandlers (emptyObj, bus);
      const ev = new Event ();
      ev.target = {value: 'x', nodeName: 'INPUT', nodeType: 1};
      eh.handleFocus (ev);
      expect (ev.propagationStop).to.equal (1);
      expect (ev.defaultPrevention).to.equal (0);
    });
  });

  describe ('handleChange()', () => {
    it ('does not invoke bus.notify() when event has no target', () => {
      const bus = new Bus ();
      const eh = new EventHandlers (emptyObj, bus);
      const ev = new Event ();
      eh.handleChange (ev);
      expect (bus).to.have.property ('_count', 0);
    });

    it ('invokes bus.notify()', () => {
      const bus = new Bus ();
      const eh = new EventHandlers (emptyObj, bus);
      const ev = new Event ();
      ev.target = {value: 'x', nodeName: 'INPUT', nodeType: 1};
      eh.handleChange (ev);
      expect (bus).to.have.property ('_count', 1);
      expect (bus).to.have.property ('_props', emptyProps);
      expect (bus).to.have.property ('_value', 'x');
      expect (bus).to.have.property ('_states').deep.equal ([{from: 0, to: 0}]);
    });

    it ('stops event propagation and prevents default event handling', () => {
      const bus = new Bus ();
      const eh = new EventHandlers (emptyObj, bus);
      const ev = new Event ();
      ev.target = {value: 'x', nodeName: 'INPUT', nodeType: 1};
      eh.handleChange (ev);
      expect (ev.propagationStop).to.equal (1);
      expect (ev.defaultPrevention).to.equal (1);
    });
  });

  describe ('handleKeyDown()', () => {
    it ('does not invoke bus.notify() when event has no target', () => {
      const bus = new Bus ();
      const eh = new EventHandlers (emptyObj, bus);
      const ev = new Event ();
      eh.handleKeyDown (ev);
      expect (bus).to.have.property ('_count', 0);
    });

    it ('invokes bus.notify()', () => {
      const bus = new Bus ();
      const eh = new EventHandlers (emptyObj, bus);
      const ev = new Event ();
      ev.target = {value: 'x', nodeName: 'INPUT', nodeType: 1};
      eh.handleKeyDown (ev);
      expect (bus).to.have.property ('_count', 1);
      expect (bus).to.have.property ('_props', emptyProps);
      expect (bus).to.have.property ('_value', 'x');
      expect (bus).to.have.property ('_states').deep.equal ([{from: 0, to: 0}]);
    });

    it ('with debug function logs event', () => {
      const bus = new Bus ();
      const eh = new EventHandlers (emptyObj, bus);
      const ev = new Event ();
      let log = '';
      eh.debug = (c, s, e) => {
        expect (c).to.equal (emptyObj);
        log = `${s}: ${e.target.value}`;
      };
      ev.target = {value: 'x', nodeName: 'INPUT', nodeType: 1};
      eh.handleKeyDown (ev);
      expect (log).to.equal ('key-down: x');
    });
  });
});

/******************************************************************************/
