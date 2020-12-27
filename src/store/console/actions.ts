import { Dispatch, ReactNode } from 'react'
import { parseStatement } from './commands'
import { Statement, StatementResult } from "./reducer"

export const RECEIVE_STATEMENT = 'RECEIVE_STATEMENT'
export function receiveStatement(stmt: Statement) {
  return {
    type: RECEIVE_STATEMENT,
    payload: stmt
  } as const
}

export const COMPLETE_STATEMENT = 'COMPLETE_STATEMENT'
export function completeStatement(result: StatementResult) {
  return {
    type: COMPLETE_STATEMENT,
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


export function execStatement(dispatch: Dispatch<ConsoleAction>, stmt: Statement) {
  if (stmt.input.trim() === '') {
    // no-op
    return
  }

  parseStatement(stmt)
  dispatch(receiveStatement(stmt))

  if (!stmt.prompt && stmt.cmd?.exec) {
    stmt.cmd.exec(stmt.argv || [], stmt.opts || {}, (output: ReactNode) => {
      dispatch(completeStatement({stmt, output}))
    })
  }
}

export type ConsoleAction = ReturnType<typeof completeStatement> | ReturnType<typeof nextStatement> | ReturnType<typeof prevStatement> | ReturnType<typeof receiveStatement>