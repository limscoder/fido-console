import { Dispatch } from 'react'
import { execStatement } from '../console/actions'
import { ConnectBastionResult, ReceiveAuthenticationResult } from './reducer'
import { AppAction, AppState } from '..'

// const defaultBastion = 'kjab0yhwz6.execute-api.us-west-1.amazonaws.com'

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
    input: `status`
  })
}

export function authenticateSession() {
  return (dispatch: Dispatch<AppAction>, getState: () => AppState) => {
    dispatch(execStatement({time: new Date(), input: `login`}))
  }
}

export function connectSession() {
  return (dispatch: Dispatch<AppAction>, getState: () => AppState) => {
    dispatch(execStatement({time: new Date(), input: `connect`}))
  }
}

export function disconnectSession() {
  return (dispatch: Dispatch<AppAction>, getState: () => AppState) => {
    dispatch(execStatement({time: new Date(), input: `logout`}))
  }
}

export type SessionAction = ReturnType<typeof connectBastion> | ReturnType<typeof receiveAuthentication>