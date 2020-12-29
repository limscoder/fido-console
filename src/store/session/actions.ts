import { Dispatch } from 'react'
import { execStatement } from '../console/actions'
import { ConnectBastionResult } from './reducer'
import { AppAction, AppState } from '..'

const defaultBastion = 'kjab0yhwz6.execute-api.us-west-1.amazonaws.com'

export const CONNECT_BASTION = 'CONNECT_BASTION'
export function connectBastion(result: ConnectBastionResult) {
  return {
    type: CONNECT_BASTION,
    payload: result
  } as const
}

export function initSession() {
  return execStatement({
    time: new Date(),
    input: `connect --host=${defaultBastion}`
  })
}

export function authenticateSession() {
  return (dispatch: Dispatch<AppAction>, getState: () => AppState) => {
    const host = getState().sessionState.bastion
    dispatch(execStatement({time: new Date(), input: `connect --host=${host} ~token`}))
  }
}

export type SessionAction = ReturnType<typeof connectBastion> 