import React from 'react'
import Status from '../../../components/Status'
import { commandRequest, RestResponse } from './request'
import { CommandContext } from "../reducer"

export const status = {
  name: 'status',
  description: 'console system status',
    usage: 'status',
    exec: async (context: CommandContext) => {
      if (context.getState().sessionState.authenticated) {
        await commandRequest({ context, url: '/directive/list', method: 'GET' }, (response: RestResponse) => {
          return {
            output: (<Status directives={ response.body.directives } />)
          }
        })
      } else {
        let output = (<Status />)
        context.onComplete({output})
      }
    }
}
