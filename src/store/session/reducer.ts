import produce from "immer"
import { AppAction } from '..'
import { CONNECT_BASTION, RECEIVE_AUTHENTICATION } from "./actions"

export interface ConnectBastionResult {
  cxnId: string
  clientId: string
  bastion: string
  apiUrl: string,
  user: string,
  authenticated: boolean
}

export interface ReceiveAuthenticationResult {
  user: string
  clientId: string
  authenticated: boolean
}

export interface SessionState {
  cxnId: string
  clientId: string
  bastion: string
  apiUrl: string
  user: string
  authenticated: boolean
}

export const initialSessionState = {
  cxnId: '',
  clientId: '',
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
      draft.clientId = action.payload.clientId
      draft.apiUrl = action.payload.apiUrl
      draft.user = action.payload.user
      draft.authenticated = action.payload.authenticated
      break
    case RECEIVE_AUTHENTICATION:
      draft.user = action.payload.user
      draft.clientId = action.payload.clientId
      draft.authenticated = action.payload.authenticated
      break
  }
})
