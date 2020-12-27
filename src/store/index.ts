import combineReducers from 'react-combine-reducers'
import { ConsoleAction } from './console/actions'
import { ConsoleState, consoleReducer, initialConsoleState } from './console/reducer'
import { UserState, userReducer, initialUserState } from './user/reducer'

export interface AppState {
    consoleState: ConsoleState
    userState: UserState
}
export type AppAction = ConsoleAction
export type AppReducer = (state: AppState, action: AppAction) => AppState

export const [appReducer, initialAppState] = combineReducers<AppReducer>({
    consoleState: [consoleReducer, initialConsoleState],
    userState: [userReducer, initialUserState]
})