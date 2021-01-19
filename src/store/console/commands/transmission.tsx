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
      description: 'generate downlink decode key',
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
        required: true
      }],
      exec: async (context: CommandContext) => {
        context.onComplete({
          output: <Decrypter stationId={ context.opts['station'] }
                             alignment={ context.opts['alignment'] } />})
      }
    }, {
      name: 'downlink',
      description: 'show decoded downlink transmissions',
      usage: 'transmision downlink',
      prompts: [{
        flag: 'station',
        prompt: 'enter station id:',
        description: 'station id',
        required: true
      }, {
        flag: 'key',
        prompt: 'enter downlink decode key:',
        description: 'downlink decode key',
        required: true
      }],
      exec: async (context: CommandContext) => {
        const opts = {
          context,
          url: '/transmission/downlink',
          method: 'POST',
          payload: {
            station: context.opts['station'],
            key: JSON.parse(context.opts['key'])
          }
        }

        await commandRequest(opts, (response: RestResponse) => {
          // TODO: trigger data fetch with decode key
          return {
            output: <p>Station transmissions decoded</p>
          }
        })
      }
    }, {
      name: 'uplink',
      description: 'transmit uplink command',
      usage: 'transmision uplink',
      prompts: [{
        flag: 'station',
        prompt: 'enter station id:',
        description: 'station id',
        required: true
      }, {
        flag: 'command',
        prompt: 'enter command code:',
        description: 'command code',
        required: true
      }],
      exec: async (context: CommandContext) => {
        const opts = {
          context,
          url: '/transmission/uplink',
          method: 'POST',
          payload: {
            station: context.opts['station'],
            command: context.opts['command']
          }
        }

        await commandRequest(opts, (response: RestResponse) => {
          return {
            output: <p>{ response.body.result }</p>
          }
        })
      }
    }
  ]
}
