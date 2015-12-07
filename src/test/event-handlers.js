'use strict';

import {expect} from 'mai-chai';

import EventHandlers from '../event-handlers.js';

/******************************************************************************/

const emptyProps = {};
const emptyBus = {};

describe ('EventHandlers', () => {
  describe ('constructor()', () => {
    it ('creates an instance', () => {
      const eh = new EventHandlers (emptyProps);
      expect (eh).to.exist ();
      expect (eh).to.have.property ('props', emptyProps);
      expect (eh).to.have.property ('bus', undefined);
    });
  });

  describe ('bus', () => {
    it ('calls bus call-back', () => {
      let busCalled = 0;
      const eh = new EventHandlers (emptyProps, () => (busCalled++, emptyBus));
      expect (busCalled).to.equal (0);
      expect (eh).to.have.property ('bus', emptyBus);
      expect (busCalled).to.equal (1);
    });
  });

  describe ('handleKeyDown()', () => {
    class Bus {
      constructor () {
        this._count = 0;
      }
      notify (props, value, ...states) {
        this._count++;
        this._props = props;
        this._value = value;
        this._states = states;
      }
    }

    it ('does not invoke bus.notify() when event has no target', () => {
      const bus = new Bus ();
      const eh = new EventHandlers (emptyProps, bus);
      eh.handleKeyDown ({});
      expect (bus).to.have.property ('_count', 0);
    });

    it ('invokes bus.notify()', () => {
      const bus = new Bus ();
      const eh = new EventHandlers (emptyProps, bus);
      eh.handleKeyDown ({target: {value: 'x'}});
      expect (bus).to.have.property ('_count', 1);
      expect (bus).to.have.property ('_props', emptyProps);
      expect (bus).to.have.property ('_value', 'x');
      expect (bus).to.have.property ('_states').deep.equal ([{from: 0, to: 0}]);
    });
  });
});

/******************************************************************************/
