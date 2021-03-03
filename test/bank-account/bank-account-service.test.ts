import {
  depositIntoAccount,
  Transaction,
  withdrawFromAccount,
} from '../../src/bank-account/bank-account-service'

describe('bank account service', () => {
  describe('withdrawing funds', () => {
    it('withdraws funds when there are enough funds in the account to cover the withdrawal', () => {
      const now: Date = new Date()
      const yesterday: Date = new Date(now)
      const dayBeforeYesterday: Date = new Date(now)

      yesterday.setDate(now.getDate() - 1)
      dayBeforeYesterday.setDate(now.getDate() - 2)

      const currentTransactions: Transaction[] = [
        {
          accountNumber: 10203040,
          sortCode: 102030,
          amount: 150,
          date: yesterday,
        },
        {
          accountNumber: 10203040,
          sortCode: 102030,
          amount: 50,
          date: dayBeforeYesterday,
        },
      ]

      const result = withdrawFromAccount(
        100,
        10203040,
        102030,
        currentTransactions,
        false,
        false,
        now
      )

      expect(result.isSuccess).toBeTruthy()
      expect(result.transactions[0].accountNumber).toEqual(10203040)
      expect(result.transactions[0].sortCode).toEqual(102030)
      expect(result.transactions[0].amount).toEqual(-100)
      expect(result.transactions[0].date).toEqual(now)
    })

    it('does not withdraw funds when there are not enough funds in the account to cover the withdrawal', () => {
      const now: Date = new Date()
      const yesterday: Date = new Date(now)
      const dayBeforeYesterday: Date = new Date(now)

      yesterday.setDate(now.getDate() - 1)
      dayBeforeYesterday.setDate(now.getDate() - 2)

      const currentTransactions: Transaction[] = [
        {
          accountNumber: 10203040,
          sortCode: 102030,
          amount: 40,
          date: yesterday,
        },
        {
          accountNumber: 10203040,
          sortCode: 102030,
          amount: 50,
          date: dayBeforeYesterday,
        },
      ]

      const result = withdrawFromAccount(
        100,
        10203040,
        102030,
        currentTransactions,
        false,
        false,
        now
      )

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Account has insufficient funds.')
    })

    it('does not withdraw funds when account is closed', () => {
      const result = withdrawFromAccount(100, 10203040, 102030, [], true, false, new Date())

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Account is closed.')
    })

    it('does not withdraw funds when account is frozen', () => {
      const result = withdrawFromAccount(100, 10203040, 102030, [], false, true, new Date())

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Account is currently frozen.')
    })
  })

  describe('depositing funds', () => {
    it('deposits funds into the account', () => {
      const now: Date = new Date()
      const yesterday: Date = new Date(now)
      const dayBeforeYesterday: Date = new Date(now)

      yesterday.setDate(now.getDate() - 1)
      dayBeforeYesterday.setDate(now.getDate() - 2)

      const currentTransactions: Transaction[] = [
        {
          accountNumber: 10203040,
          sortCode: 102030,
          amount: 150,
          date: yesterday,
        },
        {
          accountNumber: 10203040,
          sortCode: 102030,
          amount: 50,
          date: dayBeforeYesterday,
        },
      ]

      const result = depositIntoAccount(
        666,
        10203040,
        102030,
        currentTransactions,
        false,
        false,
        now
      )

      expect(result.isSuccess).toBeTruthy()
      expect(result.transactions[0].accountNumber).toEqual(10203040)
      expect(result.transactions[0].sortCode).toEqual(102030)
      expect(result.transactions[0].amount).toEqual(666)
      expect(result.transactions[0].date).toEqual(now)
    })

    it('does not allow 0 funds to be deposited', () => {
      const result = depositIntoAccount(0, 10203040, 102030, [], false, false, new Date())

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Can not deposit 0 funds.')
    })

    it('does not allow negative funds to be deposited', () => {
      const result = depositIntoAccount(-100, 10203040, 102030, [], false, false, new Date())

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Can not deposit negative funds.')
    })

    it('does not deposit funds when account is closed', () => {
      const result = depositIntoAccount(100, 10203040, 102030, [], true, false, new Date())

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Account is closed.')
    })

    it('does not withdraw funds when account is frozen', () => {
      const result = depositIntoAccount(100, 10203040, 102030, [], false, true, new Date())

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Account is currently frozen.')
    })
  })
})
