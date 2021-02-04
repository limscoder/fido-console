import React from 'react'
import Table from '../../../components/Table'
import { CommandContext } from "../reducer"
import { commandRequest, RestResponse } from './request'
import Button from '../../../components/Button'
import Directive from '../../../components/Directive'
import { execStatement } from '../actions'

export const directive = {
  name: 'directive',
  description: 'access NTBN directives',
  usage: 'directive [command]',
  subCommands: [
    {
      name: 'list',
      description: 'list directives',
      usage: 'directive list [flags]',
      exec: async (context: CommandContext) => {
        await commandRequest({ context, url: '/directive/list', method: 'GET' }, (response: RestResponse) => {
          let unlockedCount = 0
          const rows = response.body.directives.map((d: any) => {
            const onDescribe = () => {
              context.dispatch(execStatement({ time: new Date(), input: `directive describe --directive=${d.id}` }))
            }
            const link = <Button onClick={onDescribe}>{ d.title }</Button>
            let status = '-- locked --'
            if (d.unlocked) {
              status = d.unlocked
              unlockedCount++
            }
            return [d.id, link, status]
          })

          return {
            output: (
              <div>
                <p>unlocked: { unlockedCount }/{ rows.length }</p>
                <Table header={['ID', 'Directive', 'Activation Date']} rows={rows} />
              </div>
              
            )
          }
        })
      }
    }, {
      name: 'describe',
      description: 'describe directive',
      usage: 'directive describe [flags]',
      prompts: [{
        flag: 'directive',
        prompt: 'enter directive:',
        description: 'directive',
        required: true
      }],
      exec: async (context: CommandContext) => {
        await commandRequest({ context, url: `/directive/${context.opts.directive}`, method: 'GET' }, (response: RestResponse) => {
          const onUnlock = () => {
            context.dispatch(execStatement({ time: new Date(), input: `directive unlock --directive=${context.opts.directive}` }))
          }
          
          return {
            output: (
              <Directive directive={ response.body.directive } onUnlock={ onUnlock } />
            )
          }
        })
      }
    }, {
      name: 'unlock',
      description: 'unlock directive with security key',
      usage: 'directive unlock [flags]',
      prompts: [{
        flag: 'directive',
        prompt: 'enter directive:',
        description: 'directive',
        required: true
      }, {
        flag: 'key',
        prompt: 'enter security key:',
        description: 'security key',
        required: true
      }],
      exec: async (context: CommandContext) => {
        const opts = {
          context,
          url: `/directive/${context.opts.directive}/unlock`,
          method: 'POST',
          payload: { key: context.opts.key }
        }
        await commandRequest(opts, (response: RestResponse) => {
          return {
            output: (
              <div>
                <p>Directive activated!</p>
                <Directive directive={ response.body.directive } onUnlock={ () =>{} } />
              </div>
            )
          }
        })
      }
    }
  ]
}
