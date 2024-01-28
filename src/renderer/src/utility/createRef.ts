interface Reference<T> {
  _value: T;
  _initValue: T;
  set(value: T);
  get(): T;
  reset(): void;
  update(func: (arg: T) => T);
}

export default function createRef<T>(value: T): Reference<T> {
  return {
    _value: value,
    _initValue: value,
    
    set(value) {
      this._value = value;
    },
    reset() {
      this._value = this._initValue;
    },
    get() {
      return this._value;
    },
    update(func) {
      this._value = func(this._value);
    },
  } as Reference<T>;
}
