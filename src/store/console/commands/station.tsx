import React, { useCallback } from 'react'
import Warn from '../../../components/Warn'
import Error from '../../../components/Error'
import Table from '../../../components/Table'
import Status from '../../../components/Status'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'
import Button from '../../../components/Button'
import { execStatement } from '../actions'

export const station = {
  name: 'station',
  description: 'control stations command',
  usage: 'station [command]',
  subCommands: [
    {
      name: 'list',
      description: 'list control stations',
      usage: 'station list',
      exec: async (context: CommandContext) => {
        await commandRequest({ context, url: '/station/list', method: 'GET' }, (response: RestResponse) => {
          const rows = response.body.stations.map((s: any) => {
            let status = s.status
            if (s.status === 'offline') {
              status = <Error showIcon>station offline</Error>
            } else if (s.status === 'fault') {
              status = <Warn showIcon>fault detected</Warn>
            }
            const onStatus = () => {
              context.dispatch(execStatement({ time: new Date(), input: `station status --station=${s.id}` }))
            }
            const link = <Button onClick={ onStatus }>status</Button>
            return [s.id, s.name, status, link]
          })

          return {
            output: (
              <Table header={ ['ID', 'Station', 'Connection', 'Status'] } rows={ rows } />
            )
          }
        })
      }
    }, {
      name: 'status',
      description: 'show control station status',
      usage: 'station status [flags]',
      prompts: [{
        flag: 'station',
        prompt: 'enter station id:',
        description: 'station id',
        required: true
      }],
      exec: async (context: CommandContext) => {
        await commandRequest({ context, url: `/station/${context.opts.station}`, method: 'GET' }, (response: RestResponse) => {
          const s = response.body.station
          const onAlign = (id: string, control: string) => {
            context.dispatch(execStatement({ time: new Date(), input: `signal align --station=${id} --control=${control}` }))
          }
          const onDecode = (id: string) => {
            context.dispatch(execStatement({ time: new Date(), input: `transmission decode --station=${id}` }))
          }
          const onReceive = () => { 
            context.dispatch(execStatement({ time: new Date(), input: `signal receive --station=${s.id}` }))
          }
          const onTransmit = () => { 
            context.dispatch(execStatement({ time: new Date(), input: `signal transmit --station=${s.id}` }))
          }
          return {
            output: <Status id={ s.id }
                            name={ s.name }
                            control={ s.control }
                            downlink={ s.downlink }
                            uplink={ s.uplink }
                            logs={ s.logs }
                            onAlign={ onAlign }
                            onDecode={ onDecode }
                            onReceive={ onReceive }
                            onTransmit={ onTransmit } />
          }
        })
      }
    }
  ]
}
