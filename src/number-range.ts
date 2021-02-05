export class NumberRange {
  constructor(private readonly _min, private readonly _max) {}

  min() {
    return this._min
  }

  max() {
    return this._max
  }
}
