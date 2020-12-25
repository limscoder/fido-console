import produce from "immer"
import { ReactNode } from "react"
import {ConsoleAction, BEGIN_STATEMENT, NEXT_STATEMENT, PREV_STATEMENT, RECEIVE_STATEMENT } from "./actions"

const historyLimit = 250

export interface Statement {
  time: Date
  input: string 
}

export interface StatementResult {
  stmt: Statement
  output: ReactNode
}

export interface ConsoleState {
  stmt: Statement
  busy: boolean
  results: StatementResult[]
  history: string[]
  historyIdx: number
}

export const initialConsoleState: ConsoleState = {
  stmt: {
    time: new Date(),
    input: ""
  },
  busy: false,
  results: [],
  history: [],
  historyIdx: -1
}

export const consoleReducer = produce((draft: ConsoleState, action: ConsoleAction) => {
  switch (action.type) {
    case BEGIN_STATEMENT:
      draft.busy = true
      break
    case RECEIVE_STATEMENT:
      // reset statement
      draft.stmt = { time: new Date(), input: '' }
      draft.historyIdx = -1
      draft.busy = false

      // update history
      const stmt = action.payload.stmt
      if (draft.history.length < 1 || stmt.input !== draft.history[draft.history.length - 1]) {
        draft.history = draft.history.concat(stmt.input)
        if (draft.history.length > historyLimit) {
          draft.history.shift()
        }
      }

      // update results
      draft.results = draft.results.concat(action.payload)
      if (draft.results.length > historyLimit) {
        draft.results.shift()
      }
      break
    case NEXT_STATEMENT:
      if (draft.historyIdx !== -1) {
        const nextIdx = draft.historyIdx === draft.history.length - 1 ? -1 : draft.historyIdx + 1
        draft.historyIdx = nextIdx
        draft.stmt.input = draft.history[nextIdx]
      }
      break
    case PREV_STATEMENT:
      const prevIdx = draft.historyIdx === -1 ? draft.history.length - 1 : draft.historyIdx - 1
      if (prevIdx > -1) {
          draft.historyIdx = prevIdx
          draft.stmt.input = draft.history[prevIdx]
      }
      break
    }
})
