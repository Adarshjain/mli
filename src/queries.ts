import {config, tableNames} from "@/constants";
import {connect} from "@planetscale/database/dist";

export const getCustomerByIdQuery = (id: string) => `SELECT * FROM ${tableNames.customers} where id=${id}`
export const getAllCustomersQuery = () => `SELECT * FROM ${tableNames.customers}`
export const getAllTransactionsQuery = () => `SELECT * FROM ${tableNames.transactions}`
export const getProjectByIdQuery = (id: string) => `SELECT * FROM ${tableNames.projects} where id=${id}`
export const getProjectsByCustomerIdQuery = (id: string) => `SELECT * FROM ${tableNames.projects} where customer_id=${id}`
export const getTransactionByProjectsIdAndCustomerIdQuery = (customerId: string, projectId: string) => `SELECT * FROM Transactions where customer_id=${customerId} AND project_id=${projectId} order by transact_date asc`
export const getTransactionByCustomerIdQuery = (id: string) => `SELECT * FROM Transactions where customer_id=${id} order by transact_date asc`


export const execQuery = async (query: string) => {
  const conn = connect(config)
  const {rows} = await conn.execute(query) as any
  return rows
}

export const execInsertQuery = async (query: string) => {
  const conn = connect(config)
  return await conn.execute(query) as any
}

export function generateInsertQuery(tableName: string, fields: Record<string, string | number | boolean>) {
  return `INSERT INTO ${tableName} (${Object.keys(fields).join(",")}) VALUES (${Object.values(fields).map(v => JSON.stringify(v)).join(',')})`
}
