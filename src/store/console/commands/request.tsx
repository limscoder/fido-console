import { CommandCompleteCallback, CommandResult } from "../reducer"

export interface RestOptions {
  url: string
  method?: string
  payload?: any
} 

export interface RestResponse {
  ok: boolean
  body: any
}

const restRequest = async (url: string, payload: any = {}, method = 'POST') => {
  let response
  try {
    response = await fetch(url, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    return {
      ok: false,
      body: {
        Code: 'RequestError',
        Message: error.toString()
      }
    }
  }

  let body
  try {
    body = await response.json()
  } catch (error) {
    return {
      ok: false,
      body: {
        Code: 'RequestError',
        Message: error.toString()
      }
    }
  }

  return {
    ok: response.ok,
    body
  }
}

const completeResponse = (response: RestResponse, onComplete: CommandCompleteCallback, handler: (response: RestResponse) => CommandResult) => {
  if (response.ok) {
    onComplete(handler(response))
  } else {
    onComplete({
      error: response.body.Message,
      output: ''
    })
  }
}

export const commandRequest = async (opts: RestOptions, onComplete: CommandCompleteCallback, responseHandler: (response: RestResponse) => CommandResult) => {
  const response = await restRequest(opts.url, opts.payload, opts.method)
  completeResponse(response, onComplete, responseHandler)
}
