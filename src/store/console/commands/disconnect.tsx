import React from 'react'
import Warn from '../../../components/Warn'
import { receiveAuthentication } from '../../session/actions'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'

export const disconnect = {
  name: 'disconnect',
  description: 'disconnect to bastion host',
    usage: 'disconnect',
    // exec: async (context: CommandContext) => {
    //   await commandRequest({ context, url: '/session/disconnect', payload: context.opts }, (response: RestResponse) => {
    //     return {
    //       actions: [receiveAuthentication({
    //         user: '',
    //         clientId: '',
    //         authenticated: false,
    //       })],
    //       output: <p>Disconnected.</p>
    //     }
    //   })
    // }
  // }
}
