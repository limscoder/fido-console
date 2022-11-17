import React from 'react'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'

export const reset = {
  name: 'reset-token',
  description: 'reset authentication token',
  usage: 'reset-token',
  prompts: [{
    flag: 'email',
    prompt: 'enter email address:',
    description: 'token email address',
    required: true
  }],
  authenticated: false,
  exec: async (context: CommandContext) => {
    const payload = {
      email: context.opts.email,
    }
    await commandRequest({ context, url: '/session/token/request', payload }, (response: RestResponse) => {
      return {
        output: <p>Access token successfully created.</p>
      }
    })
  }
}
