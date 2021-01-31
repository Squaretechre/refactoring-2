export interface Reading {
  temp: number
  time: string
}

export interface Station {
  name: string
  readings: Reading[]
}

export interface OperatingPlan {
  temperatureFloor: number
  temperatureCeiling: number
}

export function readingsOutsideRange(station: Station, min: number, max: number): Reading[] {
  return station.readings.filter((r) => r.temp < min || r.temp > max)
}
