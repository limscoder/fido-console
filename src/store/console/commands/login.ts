import { CommandCompleteCallback, OptionMap } from "../reducer"

export const login = {
  name: 'login',
  description: 'authenticate user',
  usage: 'login [flags]',
  prompts: [{
    flag: 'token',
    prompt: 'enter authentication token:',
    description: 'authentication token',
    required: true
  }, {
    flag: 'test',
    prompt: 'enter test token:',
    description: 'test token',
    required: true
  }],
  exec: (argv: string[], opts: OptionMap, onComplete: CommandCompleteCallback) => {
    onComplete('foo!')
  },
}