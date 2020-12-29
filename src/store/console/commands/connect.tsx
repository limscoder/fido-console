import React from 'react'
import Warn from '../../../components/Warn'
import { connectBastion } from '../../session/actions'
import { CommandCompleteCallback, OptionMap } from "../reducer"
import { request } from './request'

function apiUrl(host: string) {
  return `https://${host}/api`
}

export const connect = {
  name: 'connect',
  description: 'connect to bastion host',
  usage: 'connect [flags]',
  prompts: [{
    flag: 'host',
    prompt: 'enter host:',
    description: 'bastion host domain',
    required: true
  }, {
    flag: 'token',
    prompt: 'enter authentication token:',
    description: 'authentication token',
    required: false
  }],
  exec: async (argv: string[], opts: OptionMap, onComplete: CommandCompleteCallback) => {
    const host = opts.host
    const url = `${apiUrl(host)}/connect`
    const response = await request(url)
    if (response.ok) {
      onComplete({
        actions: [connectBastion({
          cxnId: response.body.cxnId,
          bastion: host,
          apiUrl: apiUrl(host)
        })],
        output: (
          <React.Fragment>
            <p>Connected to secure bastion host [{ host }].</p>
            <p><Warn showIcon>Authorized use only. Unapproved access prohibited.</Warn></p>
          </React.Fragment>
        )
      })
    } else {
      onComplete({
        error: response.body.Message,
        output: ''
      })
    }
  },
}

// const url = `https://${opts.host}/api/connect`
// const response = await fetch(url, {
//   method: 'POST',
//   mode: 'cors',
//   cache: 'no-cache',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({})
// });

// // onComplete()
// response.json