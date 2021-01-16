import React from 'react'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'
import Decrypter from '../../../components/Decrypter'

export const transmission = {
  name: 'transmission',
  description: 'transmission interaction commands',
  usage: 'transmission [command]',
  subCommands: [
    {
      name: 'decode',
      description: 'decode station transmissions',
      usage: 'transmision decode',
      prompts: [{
        flag: 'station',
        prompt: 'enter station id:',
        description: 'station id',
        required: true
      }, {
        flag: 'alignment',
        prompt: 'enter transmission alignment:',
        description: 'transmission alignment',
        required: false
      }, {
        flag: 'key',
        prompt: 'enter transmission decode key:',
        description: 'transmission decode key',
        required: false
      }],
      exec: async (context: CommandContext) => {
        if (context.opts['key']) {
          console.log(context.opts)
          const opts = {
            context,
            url: '/transmission/decode',
            method: 'POST',
            payload: {
              station: context.opts['station'],
              alignment: JSON.parse(context.opts['alignment']),
              key: JSON.parse(context.opts['key'])
            }
          }

          await commandRequest(opts, (response: RestResponse) => {
            // TODO: trigger data fetch with decode key
            return {
              output: <p>Transmission decoded</p>
            }
          })
        } else {
          context.onComplete({output: <Decrypter stationId={ context.opts['station'] } />})
        }
      }
    },
  ]
}
