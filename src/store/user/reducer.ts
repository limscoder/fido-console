import produce from "immer"
import { AppAction } from '..'

export interface UserState {
  username: string
  authenticated: boolean
}

export const initialUserState = {
  username: '',
  authenticated: false
}

export const userReducer = produce((draft: UserState, action: AppAction) => {})
