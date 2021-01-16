import React from 'react'
import Warn from '../../../components/Warn'
import Table from '../../../components/Table'
import { connectBastion, receiveAuthentication } from '../../session/actions'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'

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
      exec: async (context: CommandContext) => {
        const host = context.opts.host
        const url = `${apiUrl(host)}/session/connect`
        await commandRequest({ context, url }, (response: RestResponse) => {
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
      exec: async (context: CommandContext) => {
        await commandRequest({ context, url: '/session/disconnect', payload: context.opts }, (response: RestResponse) => {
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
      exec: async (context: CommandContext) => {
        await commandRequest({ context, url: '/session/authenticate', payload: context.opts }, (response: RestResponse) => {
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
      exec: async (context: CommandContext) => {
        const payload = {
          email: context.opts.email,
          clientId: context.opts['client-id']
        }
        await commandRequest({ context, url: '/session/token/request', payload }, (response: RestResponse) => {
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
      exec: async (context: CommandContext) => {
        await commandRequest({ context, url: '/session/token/list', method: 'GET' }, (response: RestResponse) => {
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
