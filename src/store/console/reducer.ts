import produce from "immer"
import { ReactNode } from "react"
import { ConsoleAction, NEXT_COMMAND, PREV_COMMAND, RECEIVE_INPUT } from "./actions"

const historyLimit = 250

export interface Command {
  time: Date
  input: string 
}

interface HistoryResult {
  resultType: 'history'
  cmd: Command
}

interface OutputResult {
  resultType: 'output'
  output: ReactNode
}

export type CommandResult = HistoryResult | OutputResult

export interface ConsoleState {
  cmd: Command
  results: CommandResult[]
  history: string[]
  historyIdx: number
}

export const initialConsoleState: ConsoleState = {
  cmd: {
    time: new Date(),
    input: ""
  },
  results: [],
  history: [],
  historyIdx: -1
}

export const consoleReducer = produce((draft: ConsoleState, action: ConsoleAction) => {
  switch (action.type) {
    case RECEIVE_INPUT:
      draft.cmd = { time: new Date(), input: '' }
      draft.historyIdx = -1
      if (action.payload.input !== '') {
        // update history
        if (draft.history.length < 1 || action.payload.input !== draft.history[draft.history.length - 1]) {
          draft.history = draft.history.concat(action.payload.input)
          if (draft.history.length > historyLimit) {
            draft.history.shift()
          }
        }

        // update results
        draft.results = draft.results.concat({
          resultType: 'history',
          cmd: action.payload
        })
        if (draft.results.length > historyLimit) {
          draft.results.shift()
        }
      }
      break
    case NEXT_COMMAND:
      if (draft.historyIdx !== -1) {
        const nextIdx = draft.historyIdx === draft.history.length - 1 ? -1 : draft.historyIdx + 1
        draft.historyIdx = nextIdx
        draft.cmd.input = draft.history[nextIdx]
      }
      break
    case PREV_COMMAND:
      const prevIdx = draft.historyIdx === -1 ? draft.history.length - 1 : draft.historyIdx - 1
      if (prevIdx > -1) {
          draft.historyIdx = prevIdx
          draft.cmd.input = draft.history[prevIdx]
      }
      break
    }
})
