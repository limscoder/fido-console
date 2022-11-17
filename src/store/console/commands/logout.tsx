import React from 'react'
import { receiveAuthentication } from '../../session/actions'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'

export const logout = {
  name: 'logout',
  description: 'disconnect client',
  usage: 'logout',
  prompts: [],
  authenticated: true,
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
}