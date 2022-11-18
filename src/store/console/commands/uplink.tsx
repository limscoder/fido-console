import React from 'react'
import Decrypter from '../../../components/Decrypter'
import { commandRequest, RestResponse } from './request'
import { CommandContext } from "../reducer"

export const uplink = {
  name: 'uplink',
  description: 'establish tracker signal uplink',
  usage: 'uplink [flags]',
  prompts: [],
  authenticated: true,
  exec: async (context: CommandContext) => {
    await commandRequest({ context, url: '/station/uplink', method: 'GET' }, (response: RestResponse) => {
      return {
        output: (<Decrypter stationId={ response.body.id } uplink={ response.body.uplink }  />)
      }
    })
  }
}
