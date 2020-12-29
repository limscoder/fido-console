import { Dispatch } from 'react'
import combineReducers from 'react-combine-reducers'
import { ConsoleAction } from './console/actions'
import { ConsoleState, consoleReducer, initialConsoleState } from './console/reducer'
import { SessionAction } from './session/actions'
import { SessionState, sessionReducer, initialSessionState } from './session/reducer'

export interface AppState {
    consoleState: ConsoleState
    sessionState: SessionState
}
export type ThunkAction = { (dispatch: Dispatch<AppAction>, getState: () => AppState): void; type?: string; payload?: any } 
export type AppAction = ConsoleAction | SessionAction | ThunkAction
export type AppReducer = (state: AppState, action: AppAction) => AppState

export const [appReducer, initialAppState] = combineReducers<AppReducer>({
    consoleState: [consoleReducer, initialConsoleState],
    sessionState: [sessionReducer, initialSessionState]
})