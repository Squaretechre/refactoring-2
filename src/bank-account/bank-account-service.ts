export interface Transaction {
  accountNumber: number
  sortCode: number
  amount: number
  date: Date
}

interface Result {
  isSuccess: boolean
  transactions?: Transaction[]
  reason?: string
}

export const withdrawFromAccount = (
  amountToWithdraw: number,
  accountNumber: number,
  sortCode: number,
  transactions: Transaction[],
  isClosed: boolean,
  isFrozen: boolean,
  now: Date
): Result => {
  if (isClosed) return { isSuccess: false, reason: 'Account is closed.' }
  if (isFrozen) return { isSuccess: false, reason: 'Account is currently frozen.' }

  const balance = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .reduce((balance: number, transaction) => balance + transaction.amount, 0)

  if (balance < amountToWithdraw)
    return { isSuccess: false, reason: 'Account has insufficient funds.' }

  return {
    isSuccess: true,
    transactions: [
      {
        accountNumber,
        sortCode,
        amount: -amountToWithdraw,
        date: now,
      },
      ...transactions,
    ],
  }
}

export const depositIntoAccount = (
  amountToDeposit: number,
  accountNumber: number,
  sortCode: number,
  transactions: Transaction[],
  isClosed: boolean,
  isFrozen: boolean,
  now: Date
): Result => {
  if (isClosed) return { isSuccess: false, reason: 'Account is closed.' }
  if (isFrozen) return { isSuccess: false, reason: 'Account is currently frozen.' }
  if (amountToDeposit === 0) return { isSuccess: false, reason: 'Can not deposit 0 funds.' }
  if (amountToDeposit < 0) return { isSuccess: false, reason: 'Can not deposit negative funds.' }

  return {
    isSuccess: true,
    transactions: [
      {
        accountNumber,
        sortCode,
        amount: amountToDeposit,
        date: now,
      },
      ...transactions,
    ],
  }
}
