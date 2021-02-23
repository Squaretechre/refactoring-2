# Refactoring 2

Example code for weekly refactoring sessions.

Slides: https://bit.ly/39xupAQ

## Introduce Parameter Object

1. Create NumberRange class, move to `number-range.ts`:

```ts
  class NumberRange {
    constructor(
      readonly min,
      readonly max,
    ){}
  } 
```

2. Introduce range alongside existing parameters for `readingsOutsideRange`:

```ts
    const range = new NumberRange(operatingPlan.temperatureFloor, operatingPlan.temperatureCeiling)

    const alerts = readingsOutsideRange(station, operatingPlan.temperatureFloor, operatingPlan.temperatureCeiling, range)
```

3. Redirect usages of `min` and `max` to `range.min` and `range.max` in `readingsOutsideRange`:

```ts
    // from
    function readingsOutsideRange(station: Station, min: number, max: number, range: NumberRange): Reading[] {
        return station.readings.filter((r) => r.temp < min || r.temp > max)
    }
    
    // to
    function readingsOutsideRange(station: Station, min: number, max: number, range: NumberRange): Reading[] {
        return station.readings.filter((r) => r.temp < range.min || r.temp > range.max)
    }
```

4. Safe delete the unused `min` and `max` parameters:

```ts
    const alerts = readingsOutsideRange(station, range)

    function readingsOutsideRange(station: Station, range: NumberRange): Reading[] {
        return station.readings.filter((r) => r.temp < range.min || r.temp > range.max)
    }
```

5. Extract method `doesNotContain` on `r.temp < range.min || r.temp > range.max` in `readingsOutsideRange`:

```ts
    function doesNotContain(r: Reading, range: NumberRange): boolean {
      return r.temp < range.min || r.temp > range.max
    }

    export function readingsOutsideRange(station: Station, range: NumberRange): Reading[] {
      return station.readings.filter((r) => doesNotContain(r, range))
    }
```

6. Extract parameter on both occurrences of `r.temp` in `doesNotContain`:

```ts
    function doesNotContain(r: Reading, range: NumberRange, number: number): boolean {
      return number < range.min || number > range.max
    }

    export function readingsOutsideRange(station: Station, range: NumberRange): Reading[] {
      return station.readings.filter((r) => doesNotContain(r, range, r.temp))
    }
```

7. Safe delete the unused `r` parameter:

```ts
    function doesNotContain(range: NumberRange, number: number): boolean {
      return number < range.min || number > range.max
    }

    export function readingsOutsideRange(station: Station, range: NumberRange): Reading[] {
      return station.readings.filter((r) => doesNotContain(range, r.temp))
    }
```

8. Move `doesNotContain` to `number-range.ts`:

```ts
    export class NumberRange {
      constructor(readonly min, readonly max) {}
    }

    export function doesNotContain(range: NumberRange, number: number): boolean {
      return number < range.min || number > range.max
    }
    
    // In introduce-parameter-object.ts
    // import { doesNotContain } from './number-range'
```

9. Manually create method `doesNotContain(number: number): boolean` on `NumberRange` and delegate to `doesNotContain`:

```ts
    export class NumberRange {
      constructor(readonly min, readonly max) {}
      
      doesNotContain(number: number): boolean {
        return doesNotContain(this, number)
      }
    }

    export function doesNotContain(range: NumberRange, number: number) {
      return number < range.min || number > range.max
    }
```

10. Redirect call to `doesNotContain` in `readingsOutsideRange` to `range.doesNotContain`:

```ts
    function readingsOutsideRange(station: Station, range: NumberRange): Reading[] {
      return station.readings.filter((r) => range.doesNotContain(r.temp))
    }
```

11. Inline `doesNotContain` inside of `number-range.ts`:

```ts
    export class NumberRange {
      constructor(readonly min, readonly max) {}

      doesNotContain(number: number): boolean {
        return number < this.min || number > this.max
      }
    }
```

12. Remove unused import of `doesNotContain` in `introduce-parameter-object.ts`:

```ts
    import { NumberRange } from './number-range'
```
