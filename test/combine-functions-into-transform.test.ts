import { client1, client2, client3 } from '../src/combine-functions-into-class'

describe('combine functions into class', () => {
  describe('client 1', () => {
    it('calculates the base charge for a tea meter reading', () => {
      expect(client1()).toEqual(15)
    })
  })

  describe('client 2', () => {
    it('calculates the taxable charge for a tea meter reading', () => {
      expect(client2()).toEqual(10)
    })
  })

  describe('client 3', () => {
    it('calculates the base charge for a tea meter reading', () => {
      expect(client3()).toEqual(15)
    })
  })
})
