import produce from "immer"
import { Dispatch, ReactNode } from "react"
import {
  ConsoleAction,
  RECEIVE_STATEMENT,
  NEXT_STATEMENT,
  PREV_STATEMENT,
  CLEAR_STATEMENT,
  COMPLETE_STATEMENT,
  CLEAR_CONSOLE } from "./actions"
import { AppState, AppAction } from '..'

const historyLimit = 250

export interface CommandOption {
  flag: string
  description: string
  prompt?: string
  required?: boolean
}

export type OptionMap = Record<string, string>

export interface CommandResult {
  output: ReactNode,
  actions?: AppAction[],
  error?: string
}

export interface CommandContext {
  argv: string[]
  opts: OptionMap
  dispatch: Dispatch<AppAction>
  getState: () => AppState
  onComplete: (result: CommandResult) => void
}

export interface Command {
  name: string
  description?: string
  usage?: string
  subCommands?: Command[]
  prompts?: CommandOption[]
  notFound?: boolean
  authenticated?: boolean
  exec?(context: CommandContext): void
}

export interface Statement {
  time: Date
  input: string
  busy?: boolean
  cmd?: Command
  argv?: string[]
  opts?: OptionMap
  prompt?: CommandOption
}

export interface StatementResult {
  stmt: Statement
  output: ReactNode
}

export interface ConsoleState {
  stmt: Statement
  results: StatementResult[]
  history: string[]
  historyIdx: number
}

export const initialConsoleState: ConsoleState = {
  stmt: {
    time: new Date(),
    input: '',
    busy: false
  },
  results: [],
  history: [],
  historyIdx: -1
}

export const consoleReducer = produce((draft: ConsoleState, action: ConsoleAction) => {
  switch (action.type) {
    case RECEIVE_STATEMENT:
      draft.stmt = { ...action.payload, busy: true }
      break
    case COMPLETE_STATEMENT:
      // reset statement
      draft.stmt = { time: new Date(), input: '', busy: false }
      draft.historyIdx = -1

      // update history
      const stmt = action.payload.stmt
      if (stmt.input) {
        if (draft.history.length < 1 || stmt.input !== draft.history[draft.history.length - 1]) {
          draft.history = draft.history.concat(stmt.input)
          if (draft.history.length > historyLimit) {
            draft.history.shift()
          }
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
    case CLEAR_STATEMENT:
      draft.stmt = { time: new Date(), input: '' }
      break
    case CLEAR_CONSOLE:
      draft.results = []
      break
  }
})
