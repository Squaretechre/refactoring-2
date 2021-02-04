interface Product {
  basePrice: number
  discountThreshold: number
  discountRate: number
}

interface ShippingMethod {
  discountThreshold: number
  discountedFee: number
  feePerCase: number
}

export const priceOrder = (product: Product, quantity: number, shippingMethod: ShippingMethod) => {
  const basePrice = product.basePrice * quantity

  const discount =
    Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate

  const shippingPerCase =
    basePrice > shippingMethod.discountThreshold
      ? shippingMethod.discountedFee
      : shippingMethod.feePerCase

  const shippingCost = quantity * shippingPerCase

  const price = basePrice - discount + shippingCost

  return price
}
