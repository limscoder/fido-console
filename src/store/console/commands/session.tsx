import React from 'react'
import Warn from '../../../components/Warn'
import Table from '../../../components/Table'
import { connectBastion, receiveAuthentication } from '../../session/actions'
import { CommandCompleteCallback, OptionMap } from "../reducer"
import { commandRequest, RestResponse } from './request'
import { AppState } from '../../'

function apiUrl(host: string) {
  return `https://${host}/api`
}

export const session = {
  name: 'session',
  description: 'manage session connections',
  usage: 'session [command]',
  subCommands: [
    {
      name: 'connect',
      description: 'connect to bastion host',
      usage: 'session connect [flags]',
      prompts: [{
        flag: 'host',
        prompt: 'enter host:',
        description: 'bastion host domain',
        required: true
      }],
      exec: async (argv: string[], opts: OptionMap, onComplete: CommandCompleteCallback) => {
        const host = opts.host
        const url = `${apiUrl(host)}/connect`
        await commandRequest({ url }, onComplete, (response: RestResponse) => {
          return {
            actions: [connectBastion({
              cxnId: response.body.cxnId,
              clientId: response.body.clientId,
              user: response.body.user,
              authenticated: response.body.authenticated,
              bastion: host,
              apiUrl: apiUrl(host)
            })],
            output: (
              <React.Fragment>
                <p>Connected to secure bastion host [{host}].</p>
                <p><Warn showIcon>Authorized use only. Unapproved access prohibited.</Warn></p>
              </React.Fragment>
            )
          }
        })
      }
    }, {
      name: 'disconnect',
      description: 'disconnect client',
      usage: 'session disconnect',
      prompts: [],
      exec: async (argv: string[], opts: OptionMap, onComplete: CommandCompleteCallback, getState: () => AppState) => {
        const url = `${getState().sessionState.apiUrl}/disconnect`
        await commandRequest({ url, payload: opts }, onComplete, (response: RestResponse) => {
          return {
            actions: [receiveAuthentication({
              user: '',
              clientId: '',
              authenticated: false,
            })],
            output: <p>Disconnected.</p>
          }
        })
      }
    }, {
      name: 'authenticate',
      description: 'authenticate client',
      usage: 'session authenticate [flags]',
      prompts: [{
        flag: 'token',
        prompt: 'enter api authentication token:',
        description: 'api authentication token',
        required: true
      }],
      exec: async (argv: string[], opts: OptionMap, onComplete: CommandCompleteCallback, getState: () => AppState) => {
        const url = `${getState().sessionState.apiUrl}/authenticate`
        await commandRequest({ url, payload: opts }, onComplete, (response: RestResponse) => {
          return {
            actions: [receiveAuthentication({
              user: response.body.user,
              clientId: response.body.clientId,
              authenticated: response.body.authenticated,
            })],
            output: <p>User {response.body.user} authenticated.</p>
          }
        })
      }
    }, {
      name: 'request-token',
      description: 'request authentication token',
      usage: 'session request-token [flags]',
      prompts: [{
        flag: 'email',
        prompt: 'enter email address:',
        description: 'token email address',
        required: true
      }, {
        flag: 'client-id',
        prompt: 'enter client id:',
        description: 'client-id requesting access',
        required: true
      }],
      exec: async (argv: string[], opts: OptionMap, onComplete: CommandCompleteCallback, getState: () => AppState) => {
        const url = `${getState().sessionState.apiUrl}/request-access`
        const payload = {
          email: opts.email,
          clientId: opts['client-id']
        }
        await commandRequest({ url, payload }, onComplete, (response: RestResponse) => {
          return {
            output: <p>Access token successfully created.</p>
          }
        })
      }
    }, {
      name: 'list-tokens',
      description: 'list authentication tokens',
      usage: 'session list-tokens',
      prompts: [],
      exec: async (argv: string[], opts: OptionMap, onComplete: CommandCompleteCallback, getState: () => AppState) => {
        const url = `${getState().sessionState.apiUrl}/list-tokens`
        await commandRequest({ url }, onComplete, (response: RestResponse) => {
          const header = ['ID', 'Token', 'Activated']
          const rows = response.body.tokens.map((t: any) => {
            return [t.id, t.value, t.activated]
          })

          return {
            output: <Table header={header} rows={rows} />
          }
        })
      }
    },
  ]
}

// const url = `https://${opts.host}/api/connect`
// const response = await fetch(url, {
//   method: 'POST',
//   mode: 'cors',
//   cache: 'no-cache',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({})
// });

// // onComplete()
// response.json