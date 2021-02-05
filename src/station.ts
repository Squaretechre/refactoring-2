import { Reading, StationLike } from './introduce-parameter-object'

export class Station implements StationLike {
  name: string
  readings: Reading[]

  constructor(private readonly _name: string, private readonly _readings: Reading[]) {}
}
