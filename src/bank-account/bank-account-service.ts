export interface Transaction {
  accountNumber: number
  sortCode: number
  amount: number
  date: Date
}

interface Result<T> {
  isSuccess: boolean
  value?: T
  reason?: string
}

interface Transfer {
  originTransactions: Transaction[]
  destinationTransactions: Transaction[]
}

export const balance = (
  accountNumber: number,
  sortCode: number,
  transactions: Transaction[],
  isClosed: boolean,
  isFrozen: boolean
): Result<number> => {
  if (isClosed) return { isSuccess: false, reason: 'Account is closed.' }
  if (isFrozen) return { isSuccess: false, reason: 'Account is currently frozen.' }

  const balance = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .reduce((balance: number, transaction) => balance + transaction.amount, 0)

  return {
    isSuccess: true,
    value: balance,
  }
}

export const withdrawFromAccount = (
  amountToWithdraw: number,
  accountNumber: number,
  sortCode: number,
  transactions: Transaction[],
  isClosed: boolean,
  isFrozen: boolean,
  now: Date
): Result<Transaction[]> => {
  if (isClosed) return { isSuccess: false, reason: 'Account is closed.' }
  if (isFrozen) return { isSuccess: false, reason: 'Account is currently frozen.' }

  const accountBalance = balance(accountNumber, sortCode, transactions, isClosed, isFrozen).value

  if (accountBalance < amountToWithdraw)
    return { isSuccess: false, reason: 'Account has insufficient funds.' }

  return {
    isSuccess: true,
    value: [
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
): Result<Transaction[]> => {
  if (isClosed) return { isSuccess: false, reason: 'Account is closed.' }
  if (isFrozen) return { isSuccess: false, reason: 'Account is currently frozen.' }
  if (amountToDeposit === 0) return { isSuccess: false, reason: 'Can not deposit 0 funds.' }
  if (amountToDeposit < 0) return { isSuccess: false, reason: 'Can not deposit negative funds.' }

  return {
    isSuccess: true,
    value: [
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

export const transferFunds = (
  amountToTransfer: number,
  originAccountNumber: number,
  originSortCode: number,
  originTransactions: Transaction[],
  isOriginClosed: boolean,
  isOriginFrozen: boolean,
  destinationAccountNumber: number,
  destinationSortCode: number,
  destinationTransactions: Transaction[],
  isDestinationClosed: boolean,
  isDestinationFrozen: boolean,
  now: Date
): Result<Transfer> => {
  if (isOriginClosed) return { isSuccess: false, reason: 'Origin account is closed.' }
  if (isDestinationClosed) return { isSuccess: false, reason: 'Destination account is closed.' }
  if (isOriginFrozen) return { isSuccess: false, reason: 'Origin account is currently frozen.' }
  if (isDestinationFrozen)
    return { isSuccess: false, reason: 'Destination account is currently frozen.' }

  const originAccountBalance = balance(
    originAccountNumber,
    originSortCode,
    originTransactions,
    isOriginClosed,
    isOriginFrozen
  ).value

  if (originAccountBalance < amountToTransfer)
    return {
      isSuccess: false,
      reason: 'Origin account has insufficient funds to complete transfer.',
    }

  const originTransactionsAfterTransfer = [
    {
      accountNumber: originAccountNumber,
      sortCode: originSortCode,
      amount: -amountToTransfer,
      date: now,
    },
    ...originTransactions,
  ]

  const destinationTransactionsAfterTransfer = [
    {
      accountNumber: destinationAccountNumber,
      sortCode: destinationSortCode,
      amount: amountToTransfer,
      date: now,
    },
    ...destinationTransactions,
  ]

  return {
    isSuccess: true,
    value: {
      originTransactions: originTransactionsAfterTransfer,
      destinationTransactions: destinationTransactionsAfterTransfer,
    },
  }
}
