import { readingsOutsideRange, OperatingPlan, Station } from '../src/introduce-parameter-object'

describe('introduce parameter object', () => {
  it('filters out readings that fall outside of a given range', () => {
    const operatingPlan: OperatingPlan = {
      temperatureFloor: 40,
      temperatureCeiling: 52,
    }

    const station: Station = {
      name: 'ZB1',
      readings: [
        { temp: 47, time: '2016-11-10 09:10' },
        { temp: 53, time: '2016-11-10 09:20' },
        { temp: 58, time: '2016-11-10 09:30' },
        { temp: 53, time: '2016-11-10 09:40' },
        { temp: 51, time: '2016-11-10 09:50' },
      ],
    }

    const alerts = readingsOutsideRange(
      station,
      operatingPlan.temperatureFloor,
      operatingPlan.temperatureCeiling
    )

    expect(alerts).toEqual([
      { temp: 53, time: '2016-11-10 09:20' },
      { temp: 58, time: '2016-11-10 09:30' },
      { temp: 53, time: '2016-11-10 09:40' },
    ])
  })
})
