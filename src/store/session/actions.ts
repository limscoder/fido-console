import { Dispatch } from 'react'
import { execStatement } from '../console/actions'
import { ConnectBastionResult, ReceiveAuthenticationResult } from './reducer'
import { AppAction, AppState } from '..'

const defaultBastion = 'kjab0yhwz6.execute-api.us-west-1.amazonaws.com'

export const CONNECT_BASTION = 'CONNECT_BASTION'
export function connectBastion(result: ConnectBastionResult) {
  return {
    type: CONNECT_BASTION,
    payload: result
  } as const
}

export const RECEIVE_AUTHENTICATION = 'RECEIVE_AUTHENTICATION'
export function receiveAuthentication(result: ReceiveAuthenticationResult) {
  return {
    type: RECEIVE_AUTHENTICATION,
    payload: result
  } as const
}

export function initSession() {
  return execStatement({
    time: new Date(),
    input: `session connect --host=${defaultBastion}`
  })
}

export function authenticateSession() {
  return (dispatch: Dispatch<AppAction>, getState: () => AppState) => {
    const host = getState().sessionState.bastion
    dispatch(execStatement({time: new Date(), input: `session authenticate`}))
  }
}

export function disconnectSession() {
  return (dispatch: Dispatch<AppAction>, getState: () => AppState) => {
    const host = getState().sessionState.bastion
    dispatch(execStatement({time: new Date(), input: `session disconnect`}))
  }
}

export type SessionAction = ReturnType<typeof connectBastion> | ReturnType<typeof receiveAuthentication>