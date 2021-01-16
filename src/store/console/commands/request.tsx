import { CommandContext, CommandResult } from "../reducer"

export interface RestOptions {
  url: string
  context: CommandContext
  method?: string
  payload?: any
} 

export interface RestResponse {
  ok: boolean
  body: any
}

const restRequest = async (url: string, payload: any = {}, method = 'POST') => {
  const request:RequestInit = {
    method: method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (method === 'POST') {
    request.body = JSON.stringify(payload)
  }
  
  let response
  try {
    response = await fetch(url, request);
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

const completeResponse = (response: RestResponse, onComplete: (result: CommandResult) => void, handler: (response: RestResponse) => CommandResult) => {
  if (response.ok) {
    onComplete(handler(response))
  } else {
    onComplete({
      error: response.body.Message,
      output: ''
    })
  }
}

export const commandRequest = async (opts: RestOptions, responseHandler: (response: RestResponse) => CommandResult) => {
  const url = opts.url.startsWith('http') ? opts.url : (opts.context.getState().sessionState.apiUrl + opts.url)
  const response = await restRequest(url, opts.payload, opts.method)
  completeResponse(response, opts.context.onComplete, responseHandler)
}
