import React from 'react'
import Button from '../../../components/Button'
import { execStatement } from '../actions'
import { receiveAuthentication } from '../../session/actions'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'

export const login = {
  name: 'login',
  description: 'authenticate client',
  usage: 'login [flags]',
  prompts: [{
    flag: 'token',
    prompt: 'enter authentication token:',
    description: 'authentication token',
    required: true
  }],
  authenticated: false,
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
    }, () => {
      let resetPasswordHandler = () => {
        context.dispatch(execStatement({
          time: new Date(),
          input: `reset-token`
        }))
      }
      return (
        <React.Fragment>
          &nbsp;<Button onClick={ resetPasswordHandler }>reset password</Button>
          <br />
          <br />
        </React.Fragment>)
    })
  }
}
