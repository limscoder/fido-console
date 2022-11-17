import React from 'react'
import { execStatement } from '../actions'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'
import Directive from '../../../components/Directive'

export const moduleStatus = {
  name: 'module-status',
  description: 'module subsystem status',
  usage: 'module-status [flags]',
  prompts: [{
    flag: 'id',
    prompt: 'enter module id:',
    description: 'id',
    required: true
  }],
  authenticated: true,
  exec: async (context: CommandContext) => {
    await commandRequest({ context, url: `/directive/${context.opts.id}`, method: 'GET' }, (response: RestResponse) => {
      const onUnlock = () => {
        context.dispatch(execStatement({ time: new Date(), input: `module-enable --id=${context.opts.id}` }))
      }
      
      return {
        output: (
          <Directive directive={ response.body.directive } onUnlock={ onUnlock } />
        )
      }
    })
  }
}
