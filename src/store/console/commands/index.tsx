import React from 'react'
import Help from '../../../components/Help'
import { Command, Statement, OptionMap, CommandCompleteCallback } from '../reducer'
import { connect } from './connect'

const rootCmd = {
  name: 'root',
  subCommands: [
    connect
  ]
}

function help(cmd: Command, cmdNotFound: boolean): Command {
  return {
    name: 'help',
    notFound: cmdNotFound,
    exec: async (argv: string[], opts: OptionMap, onComplete: CommandCompleteCallback) => {
      onComplete({
        output: <Help cmd={ cmd } />,
        error: (cmdNotFound ? 'command not found' : undefined)
      })
    }
  }
}

function parseCmd(argv: string[], cmd: Command): Command {
  if (cmd.subCommands) {
    const targetCmd = argv[0]
    for (let i = 0; i < cmd.subCommands.length; i++) {
      const subCmd = cmd.subCommands[i]
      if (subCmd.name === targetCmd) {
        return parseCmd(argv.slice(1, argv.length), subCmd)
      }
    }

    // command not found
    return help(cmd, true)
  }

  return cmd
}

export function parseStatement(stmt: Statement) {
  const opts:OptionMap = {}
  const promptOpts:Record<string, boolean> = {}
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
    } else if (v.startsWith('~')) {
      const flag = v.match(/~+(.*)/)
      if (flag && flag.length > 0) {
        promptOpts[flag[1]] = true
      }
      return a
    }

    return a.concat([v])
  }, [])
  
  const cmd = parseCmd(argv, rootCmd)
  if (argv[0] === 'help' || opts.help) {
    stmt.cmd = help(cmd.notFound? rootCmd : cmd, false)
    return
  }
  
  stmt.cmd = cmd
  stmt.opts = opts
  stmt.argv = argv

  // set any required prompts
  stmt.prompt = undefined
  const prompts = cmd?.prompts || []
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    if (opts[prompt.flag] === undefined && (prompt.required || promptOpts[prompt.flag])) {
      stmt.prompt = prompt
      break
    }
  }
}