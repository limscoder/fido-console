import React from 'react'
import Error from '../../../components/Error'
import Help from '../../../components/Help'
import { Command, Statement, OptionMap, CommandCompleteCallback } from '../reducer'
import { login } from './login'

const rootCmd = {
  name: 'root',
  subCommands: [
    login,
  ]
}

function help(cmd: Command, cmdNotFound: boolean): Command {
  return {
    name: 'help',
    notFound: cmdNotFound,
    exec: (argv: string[], opts: OptionMap, onComplete: CommandCompleteCallback) => {
      onComplete(
        <React.Fragment>
          { cmdNotFound? <Error showIcon>command not found</Error> : null }
          <Help cmd={ cmd } />
        </React.Fragment>)
    }
  }
}

function parseCmd(argv: string[], cmd: Command): Command {
  if (cmd.subCommands) {
    const targetCmd = argv.shift()
    for (let i = 0; i < cmd.subCommands.length; i++) {
      const subCmd = cmd.subCommands[i]
      if (subCmd.name === targetCmd) {
        return parseCmd(argv, subCmd)
      }
    }

    // command not found
    return help(cmd, true)
  }

  return cmd
}

export function parseStatement(stmt: Statement) {
  const opts:OptionMap = {}
  const argv = stmt.input.split(/\s+/).reduce<string[]>((a, v) => {
    if (v.startsWith('-')) {
      // parse option or flag
      const opt = v.match(/-+(.*)="?(.*)"?/)
      if (opt && opt.length > 2) {
        opts[opt[1]] = opt[2]
      } else {
        const flag = v.match(/-+(.*)/)
        if (flag && flag.length > 0) {
          opts[flag[1]] = "true"
        }
      }
      return a
    }

    return a.concat([v])
  }, [])
  
  const cmd = parseCmd(argv, rootCmd)
  if (opts.help && !cmd.notFound) {
    // show help message
    stmt.cmd = help(cmd, false)
    return
  }
  
  stmt.cmd = cmd
  stmt.cmd = cmd
  stmt.opts = opts
  stmt.argv = argv

  // set any required prompts
  stmt.prompt = undefined
  const prompts = cmd?.prompts || []
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    if (prompt.required && opts[prompt.flag] === undefined) {
      stmt.prompt = prompt
      break
    }
  }
}


