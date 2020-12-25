import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Command } from '../store/command'

const $Help = styled.div`
  padding: 1em;
`

const $Table = styled.div`
  margin-left: 2em;
`

const $Td = styled.td`
  padding-right: 2em;
`

export default function Help(props: {cmd: Command}) {
  const sections:ReactNode[] = [];

  if (props.cmd.description) {
    sections.push(<p>Description: { props.cmd.description }</p>)
    sections.push(<br />)
  }

  if (props.cmd.usage) {
    sections.push(<p>Usage: { props.cmd.usage }</p>)
    sections.push(<br />)
  }

  if (props.cmd.subCommands && props.cmd.subCommands.length) {
    const cmdRows = props.cmd.subCommands.map((cmd) => {
      return <tr><$Td>{ cmd.name }</$Td><td>{ cmd.description }</td></tr>
    })

    sections.push(<p>Available commands:</p>)
    sections.push(<$Table><tbody>{ cmdRows }</tbody></$Table>)
  }

  return <$Help>{ sections }</$Help>
}