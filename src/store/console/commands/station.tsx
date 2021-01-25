import React from 'react'
import Error from '../../../components/Error'
import Table from '../../../components/Table'
import Decrypter from '../../../components/Decrypter'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'
import Button from '../../../components/Button'
import { execStatement } from '../actions'
import Highlight from '../../../components/Highlight'

export const station = {
  name: 'station',
  description: 'manage control stations',
  usage: 'station [command]',
  subCommands: [
    {
      name: 'list',
      description: 'list control stations',
      usage: 'station list',
      exec: async (context: CommandContext) => {
        await commandRequest({ context, url: '/station/list', method: 'GET' }, (response: RestResponse) => {
          let activeCount = 0
          const rows = response.body.stations.map((s: any) => {
            let status = s.status
            if (s.status === 'offline') {
              status = <Error showIcon>station offline</Error>
            } else {
              activeCount++
              status = <Highlight>{status.replace(/\.\d+$/, '')}</Highlight>
            }
            const onChecksum = () => {
              context.dispatch(execStatement({ time: new Date(), input: `station decode --station=${s.id} --uplink=${s.uplink}` }))
            }
            const check = <Button onClick={onChecksum}>decode checksum</Button>

            const onUplink = () => {
              context.dispatch(execStatement({ time: new Date(), input: `station uplink --station=${s.id}` }))
            }
            const link = <Button onClick={onUplink}>uplink command</Button>
            return [s.name, status, check, link]
          })

          return {
            output: (
              <div>
                <p>online: { activeCount }/{ rows.length } </p>
                <Table header={['Station', 'Connection', 'Checksum', 'Uplink']} rows={rows} />
              </div>
            )
          }
        })
      }
    }, {
      name: 'decode',
      description: 'decode station signal checksum',
      usage: 'station decode [flags]',
      prompts: [{
        flag: 'station',
        prompt: 'enter station id:',
        description: 'station id',
        required: true
      }, {
        flag: 'uplink',
        prompt: 'enter uplink code:',
        description: 'uplink code',
        required: true
      }],
      exec: async (context: CommandContext) => {
        context.onComplete({
          output: <Decrypter stationId={ context.opts['station'] }
                             alignment={ context.opts['uplink'] } />})
      }
    }, {
      name: 'validate',
      description: 'validate station signal checksum',
      usage: 'station validate [flags]',
      prompts: [{
        flag: 'station',
        prompt: 'enter station id:',
        description: 'station id',
        required: true
      }, {
        flag: 'checksum',
        prompt: 'enter checksum:',
        description: 'station signal checksum',
        required: true
      }],
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
          return { output: <p>Checksum validated: { response.body.checksum} </p> }
        })
      }
    }, {
      name: 'uplink',
      description: 'send command code via uplink',
      usage: 'station uplink [flags]',
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
      }, {
        flag: 'checksum',
        prompt: 'enter checksum:',
        description: 'checksum',
        required: true
      }],
      exec: async (context: CommandContext) => {
        const opts = {
          context,
          url: `/station/${context.opts.station}/uplink`,
          method: 'POST',
          payload: {
            command: context.opts['command'],
            checksum: context.opts['checksum']
          }
        }
        await commandRequest(opts, (response: RestResponse) => {
          return { output: <p>{ response.body.result }</p> }
        })
      }
    }
  ]
}
