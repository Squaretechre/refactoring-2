interface Reading {
  customer: string
  quantity: number
  month: number
  year: number
}

const reading: Reading = { customer: 'ivan', quantity: 10, month: 5, year: 2017 }

const acquireReading = (): Reading => reading
const baseRate = (month: number, year: number): number => 1.5
const taxThreshold = (year: number): number => 5

export const client1 = (): number => {
  const aReading = acquireReading()
  const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity

  return baseCharge
}

export const client2 = (): number => {
  const aReading = acquireReading()
  const base = baseRate(aReading.month, aReading.year) * aReading.quantity
  const taxableCharge = Math.max(0, base - taxThreshold(aReading.year))

  return taxableCharge
}

export const client3 = (): number => {
  function calculateBaseCharge(aReading) {
    return baseRate(aReading.month, aReading.year) * aReading.quantity
  }

  const aReading = acquireReading()
  const basicChargeAmount = calculateBaseCharge(aReading)

  return basicChargeAmount
}
