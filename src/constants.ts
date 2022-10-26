export const tableNames = {
  customers: 'Customers',
  projects: 'Projects',
  transactions: 'Transactions'
}

export const config = {
  host: 'aws.connect.psdb.cloud',
  username: process.env.PS_USERNAME,
  password: process.env.PS_PASS
}
