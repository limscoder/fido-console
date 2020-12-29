import React, { Dispatch } from 'react'
import Error from '../../components/Error'
import { parseStatement } from './commands'
import { CommandResult, Statement, StatementResult } from "./reducer"
import { AppAction, AppState } from '..'

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


export function execStatement(stmt: Statement) {
  return (dispatch: Dispatch<AppAction>, getState: () => AppState) => {
    const state = getState()
    const isBusy = state.consoleState.stmt.busy && !state.consoleState.stmt.prompt
    if (stmt.input.trim() === '' || isBusy) {
      // no-op
      return
    }
  
    parseStatement(stmt)
    dispatch(receiveStatement(stmt))
  
    if (!stmt.prompt && stmt.cmd?.exec) {
      stmt.cmd.exec(stmt.argv || [], stmt.opts || {}, (result: CommandResult) => {
        result.actions?.forEach(dispatch)
        let output = result.output
        if (result.error && result.error !== '') {
          output = (
            <React.Fragment>
              <p><Error showIcon>{ result.error }</Error></p>
              { output }
            </React.Fragment>
          )
        }
        dispatch(completeStatement({stmt, output}))
      })
    }
  }
}

export type ConsoleAction = ReturnType<typeof completeStatement> | ReturnType<typeof nextStatement> | ReturnType<typeof prevStatement> | ReturnType<typeof receiveStatement>