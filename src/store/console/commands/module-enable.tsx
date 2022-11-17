import React from 'react'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'

export const moduleEnable = {
  name: 'module-enable',
  description: 'enable module with security key',
  usage: 'module-enable [flags]',
  prompts: [{
    flag: 'id',
    prompt: 'enter module id:',
    description: 'id',
    required: true
  }, {
    flag: 'key',
    prompt: 'enter security key:',
    description: 'security key',
    required: true
  }],
  authenticated: true,
  exec: async (context: CommandContext) => {
    const opts = {
      context,
      url: `/directive/${context.opts.id}/unlock`,
      method: 'POST',
      payload: { key: context.opts.key }
    }
    await commandRequest(opts, (response: RestResponse) => {
      return {
        output: (
          <div>
            <p>Module enabled!</p>
          </div>
        )
      }
    })
  }
}
