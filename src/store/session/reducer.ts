import produce from "immer"
import { AppAction } from '..'
import { CONNECT_BASTION } from "./actions"

export interface ConnectBastionResult {
  cxnId: string
  bastion: string,
  apiUrl: string
}

export interface SessionState {
  cxnId: string
  bastion: string
  apiUrl: string
  user: string
  authenticated: boolean
}

export const initialSessionState = {
  cxnId: '',
  bastion: '',
  apiUrl: '',
  user: '',
  authenticated: false
}

export const sessionReducer = produce((draft: SessionState, action: AppAction) => {
  switch (action.type) {
    case CONNECT_BASTION:
      draft.bastion = action.payload.bastion
      draft.cxnId = action.payload.cxnId
      draft.apiUrl = action.payload.apiUrl
      break
  }
})
