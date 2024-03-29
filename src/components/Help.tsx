import React, { ReactNode, useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from './App' 
import { Command } from '../store/console/reducer'

const $Help = styled.div`
  margin: 1em;
`

const $Table = styled.table`
  margin-left: 2em;
`

const $Td = styled.td`
  padding-right: 2em;
`

export default function Help(props: {cmd: Command}) {
  const [store] = useContext(AppContext)
  const sections:ReactNode[] = [];

  if (props.cmd.description) {
    sections.push(<p key="description">Description: { props.cmd.description }</p>)
  }

  if (props.cmd.usage) {
    sections.push(<p key="usage">Usage: { props.cmd.usage }</p>)
  }

  if (props.cmd.subCommands && props.cmd.subCommands.length) {
    const cmdRows: ReactNode[] = []
    props.cmd.subCommands.forEach((cmd) => {
      if (cmd.authenticated === true && !store.sessionState.authenticated) {
        return
      }

      if (cmd.authenticated === false && store.sessionState.authenticated) {
        return
      }
      cmdRows.push(<tr key={ cmd.name }><$Td>{ cmd.name }</$Td><td>- { cmd.description }</td></tr>)
    })

    sections.push(<p key="commands-header">Available commands:</p>)
    sections.push(<$Table key="commands"><tbody>{ cmdRows }</tbody></$Table>)
    sections.push(<p key="about-footer">About: <a href="https://github.com/limscoder/fido-console">https://github.com/limscoder/fido-console</a></p>)
  }

  let prompts = (props.cmd.prompts || [])
  if (props.cmd.name !== 'root'){
    prompts = prompts.concat([
      {
        flag: 'help',
        description: 'show help for command',
        prompt: 'show help?'
      }
    ])
  }
  if (prompts.length) {
    const flagRows = prompts.map((prompt) => {
      return <tr key={ prompt.flag }><$Td>--{ prompt.flag }</$Td><td>- { prompt.description }</td></tr>
    })
    sections.push(<p key="flags-header">Available flags:</p>)
    sections.push(<$Table key="flags"><tbody>{ flagRows }</tbody></$Table>)
  }

  return <$Help>{ sections }</$Help>
}