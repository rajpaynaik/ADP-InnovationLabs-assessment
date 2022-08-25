const request = require('request')
const axios = require('axios')

const urlEndpoint = {
  GET: 'get-task',
  POST: 'submit-task',
}

const getURL = (methodType) =>
  `https://interview.adpeai.com/api/v2/${urlEndpoint[methodType]}`

const getUniqueEmployeeIds = (transactions) => [
  ...new Set(transactions.map((transaction) => transaction.employee.id)),
]

const sumOfTransactionsAmount = (transactions, employeeId) => {
  return transactions
    .filter((transaction) => transaction.employee.id === employeeId)
    .reduce((totalAmount, transaction) => totalAmount + transaction.amount, 0)
}

const getTopEarnersTransactionDetails = (
  transactions,
  listOfAllEmployeeAmounts,
) => {
  const topEarnersAmount = Math.max(
    ...listOfAllEmployeeAmounts.map((emp) => emp.amount),
  )

  const topEarnersId = listOfAllEmployeeAmounts.find(
    (employee) => employee.amount === topEarnersAmount,
  )

  return transactions.filter((records) => {
    return records.employee.id === topEarnersId.id
  })
}

// Q 1. get last years top earners list

const getLastYearsTopEarnersTransactionDetails = (transactions) => {
  const lastYearTransactions = transactions.filter(
    ({ timeStamp }) =>
      new Date(timeStamp).getFullYear() === new Date().getFullYear() - 1,
  )

  const listOfAllEmployeeAmounts = []

  // Calculate sum of unique employee id's
  getUniqueEmployeeIds(lastYearTransactions).map((employeeId) =>
    listOfAllEmployeeAmounts.push({
      id: employeeId,
      amount: sumOfTransactionsAmount(lastYearTransactions, employeeId),
    }),
  )

  return getTopEarnersTransactionDetails(
    lastYearTransactions,
    listOfAllEmployeeAmounts,
  )
}

// Q 2.1 filter by type alpha and last year

const getLastYearTransactionIdsByAlpha = (transactions) =>
  transactions
    .filter(({ type }) => type === 'alpha')
    .map(({ transactionID }) => transactionID)

// Q 2.2 HTTP POST request to submit the task

const filterTransactionsWithPostRequest = async () => {
  try {
    const { data } = await axios.get(getURL('GET'))

    let lastYearTopEarnerDetails = getLastYearsTopEarnersTransactionDetails(
      data.transactions,
    )

    console.log(
      "last year's Top Earners transaction details:\n",
      lastYearTopEarnerDetails,
    )

    const payload = {
      id: data.id,
      result: getLastYearTransactionIdsByAlpha(lastYearTopEarnerDetails),
    }

    console.log(
      "Transaction id's where type is alpha:\n",
      getLastYearTransactionIdsByAlpha(lastYearTopEarnerDetails),
    )
    const result = await axios.post(getURL('POST'), payload)

    return `test was successfully completed. status:${result.status}`
  } catch (e) {
    return `Error found: ${e}`
  }
}

module.exports = { filterTransactionsWithPostRequest }
