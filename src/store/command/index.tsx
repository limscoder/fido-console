import React, { Dispatch, ReactNode } from 'react'
import Error from '../../components/Error'
import Help from '../../components/Help'
import { AppAction } from '..'
import { beginStatement, receiveStatement } from '../console/actions'
import { Statement } from '../console/reducer'

export interface Command {
  name: string
  description?: string
  usage?: string
  subCommands?: Command[]
  exec?(dispatch: Dispatch<AppAction>, argv: string[]): void
}

interface CommandCallbacks {
  onComplete: (output: ReactNode) => void
}

const rootCmd = {
  name: 'root',
  subCommands: [
    {
      name: 'fooooooooooooooooooooooooooooooooooooooooooo',
      description: 'bar'
    },
    {
      name: 'baz',
      description: 'booz'
    }
  ]
}

function exec(argv: string[], cmd: Command, callbacks: CommandCallbacks): void {
  if (cmd.subCommands) {
    const targetCmd = argv.shift()
    for (let i = 0; i < cmd.subCommands.length; i++) {
      const subCmd = cmd.subCommands[i]
      if (subCmd.name === targetCmd) {
        exec(argv, subCmd, callbacks)
      }
    }

    // TODO: display help
    callbacks.onComplete(
      <React.Fragment>
        <Error showIcon>command not found</Error>
        <Help cmd={ cmd } />
      </React.Fragment>)
  }

  // execute command
  if (cmd.exec) {
    // TODO execute it bro
    // cmd.exec(dispatch, argv)
  }
}

export function execCommand(dispatch: Dispatch<AppAction>, stmt: Statement) {
  if (stmt.input.trim() === '') {
    // no-op
    return
  }

  
  dispatch(beginStatement(stmt))
  const argv = stmt.input.split(/\s+/)
  const callbacks = {
    onComplete: (output: ReactNode) => {
      dispatch(receiveStatement({ stmt, output }))
    }
  }
  exec(argv, rootCmd, callbacks)
}
