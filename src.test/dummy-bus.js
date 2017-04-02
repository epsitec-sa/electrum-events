export default class Bus {
  constructor () {
    this._count = 0;
  }
  notify (props, source, value, ...states) {
    this._count++;
    this._props = props;
    this._value = value;
    this._states = states;
  }
  dispatch (props, message) {
    this._count++;
    this._props = props;
    this._message = message;
  }
}
