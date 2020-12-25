import { Statement, StatementResult } from "./reducer"

export const BEGIN_STATEMENT = 'BEGIN_STATEMENT'
export function beginStatement(stmt: Statement) {
  return {
    type: BEGIN_STATEMENT,
    payload: stmt
  } as const
}

export const RECEIVE_STATEMENT = 'RECEIVE_STATEMENT'
export function receiveStatement(result: StatementResult) {
  return {
    type: RECEIVE_STATEMENT,
    payload: result
  } as const
}

export const NEXT_STATEMENT = 'NEXT_STATEMENT'
export function nextStatement() {
  return {
    type: NEXT_STATEMENT,
    payload: undefined
  } as const
}

export const PREV_STATEMENT = 'PREV_STATEMENT'
export function prevStatement() {
  return {
    type: PREV_STATEMENT,
    payload: undefined
  } as const
}

export type ConsoleAction = ReturnType<typeof receiveStatement> | ReturnType<typeof nextStatement> | ReturnType<typeof prevStatement> | ReturnType<typeof beginStatement>