import { priceOrder } from '../src/split-phase'

describe('split phase', () => {
  it('calculates the non discounted order price when neither the product or shipping method discount thresholds are reached', () => {
    const product = {
      basePrice: 10,
      discountThreshold: 150,
      discountRate: 0.1,
    }

    const shippingMethod = {
      discountThreshold: 150,
      discountedFee: 1,
      feePerCase: 2,
    }

    const quantity = 5

    const orderPrice = priceOrder(product, quantity, shippingMethod)

    expect(orderPrice).toBe(60)
  })

  it('applies a discount for the quantity of products that exceed the product discount threshold', () => {
    const product = {
      basePrice: 10,
      discountThreshold: 2,
      discountRate: 0.5,
    }

    const shippingMethod = {
      discountThreshold: 150,
      discountedFee: 1,
      feePerCase: 2,
    }

    const quantity = 5

    const orderPrice = priceOrder(product, quantity, shippingMethod)

    expect(orderPrice).toBe(45)
  })

  it('applies a discounted shipping fee when the base price exceeds the shipping methods discount threshold', () => {
    const product = {
      basePrice: 10,
      discountThreshold: 150,
      discountRate: 0.1,
    }

    const shippingMethod = {
      discountThreshold: 20,
      discountedFee: 1,
      feePerCase: 2,
    }

    const quantity = 5

    const orderPrice = priceOrder(product, quantity, shippingMethod)

    expect(orderPrice).toBe(55)
  })

  it('applies both product and shipping discounts when both the product and shipping method discount thresholds are exceeded', () => {
    const product = {
      basePrice: 10,
      discountThreshold: 4,
      discountRate: 0.1,
    }

    const shippingMethod = {
      discountThreshold: 10,
      discountedFee: 1,
      feePerCase: 2,
    }

    const quantity = 5

    const orderPrice = priceOrder(product, quantity, shippingMethod)

    expect(orderPrice).toBe(54)
  })
})
