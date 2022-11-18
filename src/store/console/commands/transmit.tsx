import React from 'react'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'
import Directive from '../../../components/Directive'

export const transmit = {
  name: 'transmit',
  description: 'transmit station signal',
  usage: 'transmit [flags]',
  prompts: [{
    flag: 'station',
    prompt: 'enter station id:',
    description: 'station id',
    required: true
  }, {
    flag: 'checksum',
    prompt: 'enter signal checksum:',
    description: 'signal checksum',
    required: true
  }],
  authenticated: true,
  exec: async (context: CommandContext) => {
    const opts = {
      context,
      url: `/station/${context.opts.station}/validate`,
      method: 'POST',
      payload: {
        checksum: context.opts['checksum']
      }
    }
    await commandRequest(opts, (response: RestResponse) => {
      return { output: <Directive directive={ response.body } onUnlock={ () => {} } /> }
    })
  }
}
