import {
  balance,
  depositIntoAccount,
  Transaction,
  transferFunds,
  withdrawFromAccount,
} from '../../src/bank-account/bank-account-service'

describe('bank account service', () => {
  describe('account balance', () => {
    it('calculates the current balance of the account', () => {
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

      const result = balance(10203040, 102030, currentTransactions, false, false)

      expect(result.isSuccess).toBeTruthy()
      expect(result.value).toBe(200)
    })

    it('does not get the current balance of the account when the account is closed', () => {
      const result = balance(10203040, 102030, [], true, false)

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Account is closed.')
    })

    it('does not get the current balance of the account when the account is frozen', () => {
      const result = balance(10203040, 102030, [], false, true)

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Account is currently frozen.')
    })
  })

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

      let mostRecentTransaction = result.value[0]
      const balanceAfterWithdrawal = balance(10203040, 102030, result.value, false, false)

      expect(result.isSuccess).toBeTruthy()
      expect(balanceAfterWithdrawal.value).toBe(100)
      expect(mostRecentTransaction.accountNumber).toBe(10203040)
      expect(mostRecentTransaction.sortCode).toBe(102030)
      expect(mostRecentTransaction.amount).toBe(-100)
      expect(mostRecentTransaction.date).toBe(now)
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

      let mostRecentTransaction = result.value[0]
      const balanceAfterWithdrawal = balance(10203040, 102030, result.value, false, false)

      expect(result.isSuccess).toBeTruthy()
      expect(balanceAfterWithdrawal.value).toBe(866)
      expect(mostRecentTransaction.accountNumber).toBe(10203040)
      expect(mostRecentTransaction.sortCode).toBe(102030)
      expect(mostRecentTransaction.amount).toBe(666)
      expect(mostRecentTransaction.date).toBe(now)
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

  describe('transferring funds', () => {
    it('transfers funds from the origin account to the destination account when there are enough funds in the account to cover the transfer', () => {
      const now: Date = new Date()
      const yesterday: Date = new Date(now)
      const dayBeforeYesterday: Date = new Date(now)

      yesterday.setDate(now.getDate() - 1)
      dayBeforeYesterday.setDate(now.getDate() - 2)

      const currentOriginTransactions: Transaction[] = [
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

      const result = transferFunds(
        30,
        10203040,
        102030,
        currentOriginTransactions,
        false,
        false,
        50607080,
        405060,
        [],
        false,
        false,
        now
      )

      let mostRecentOriginTransaction = result.value.originTransactions[0]
      let mostRecentDestinationTransaction = result.value.destinationTransactions[0]

      const originBalanceAfterTransfer = balance(
        10203040,
        102030,
        result.value.originTransactions,
        false,
        false
      )

      const destinationBalanceAfterTransfer = balance(
        50607080,
        405060,
        result.value.destinationTransactions,
        false,
        false
      )

      expect(result.isSuccess).toBeTruthy()

      expect(originBalanceAfterTransfer.value).toBe(170)
      expect(destinationBalanceAfterTransfer.value).toBe(30)

      expect(mostRecentOriginTransaction.accountNumber).toBe(10203040)
      expect(mostRecentOriginTransaction.sortCode).toBe(102030)
      expect(mostRecentOriginTransaction.amount).toBe(-30)
      expect(mostRecentOriginTransaction.date).toBe(now)

      expect(mostRecentDestinationTransaction.accountNumber).toBe(50607080)
      expect(mostRecentDestinationTransaction.sortCode).toBe(405060)
      expect(mostRecentDestinationTransaction.amount).toBe(30)
      expect(mostRecentDestinationTransaction.date).toBe(now)
    })

    it('does not transfer funds when there are not enough funds in the origin account to cover the transfer', () => {
      const now: Date = new Date()
      const yesterday: Date = new Date(now)

      yesterday.setDate(now.getDate() - 1)

      const currentOriginTransactions: Transaction[] = [
        {
          accountNumber: 10203040,
          sortCode: 102030,
          amount: 50,
          date: yesterday,
        },
      ]

      const result = transferFunds(
        100,
        10203040,
        102030,
        currentOriginTransactions,
        false,
        false,
        50607080,
        405060,
        [],
        false,
        false,
        now
      )

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Origin account has insufficient funds to complete transfer.')
    })

    it('does not transfer funds when the origin account is closed', () => {
      const result = transferFunds(
        100,
        10203040,
        102030,
        [],
        true,
        false,
        50607080,
        405060,
        [],
        false,
        false,
        new Date()
      )

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Origin account is closed.')
    })

    it('does not transfer funds when the destination account is closed', () => {
      const result = transferFunds(
        100,
        10203040,
        102030,
        [],
        false,
        false,
        50607080,
        405060,
        [],
        true,
        false,
        new Date()
      )

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Destination account is closed.')
    })

    it('does not transfer funds when origin account is frozen', () => {
      const result = transferFunds(
        100,
        10203040,
        102030,
        [],
        false,
        true,
        50607080,
        405060,
        [],
        false,
        false,
        new Date()
      )

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Origin account is currently frozen.')
    })

    it('does not transfer funds when destination account is frozen', () => {
      const result = transferFunds(
        100,
        10203040,
        102030,
        [],
        false,
        false,
        50607080,
        405060,
        [],
        false,
        true,
        new Date()
      )

      expect(result.isSuccess).toBeFalsy()
      expect(result.reason).toBe('Destination account is currently frozen.')
    })
  })
})
