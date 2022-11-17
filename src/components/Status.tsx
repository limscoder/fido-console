import React, { ReactNode, useContext } from 'react'
import styled from 'styled-components'
import Warn from './Warn'
import { AppAction } from '../store'
import { authenticateSession, disconnectSession } from '../store/session/actions'
import { execStatement } from '../store/console/actions'
import { AppContext } from './App'
import Button from './Button'

const $Title = styled.td`
  color: #61dafb
`

type Directive = {
  id: string
  title: string
  key?: string
  unlocked: string
  content: string[]
  instructions: string[]
}

type StatusProps = {
  directives?: Directive[] 
}

function renderAuthedElements(props: StatusProps, dispatch: React.Dispatch<AppAction>): ReactNode {
  let els: ReactNode[] = []

  let uplinkStatus: ReactNode = 'online'
  if (props.directives) {
    props.directives.forEach((directive: Directive) => {
      let directiveStatus: ReactNode
      let directiveAction: string
      let directiveCallback: () => void

      directiveAction = "module status"
      directiveCallback = () => {
        dispatch(execStatement({ time: new Date(), input: `module-status --id=${directive.id}` }))
      }
      if (directive.unlocked) {
        directiveStatus = "online"
      } else {
        directiveStatus = <Warn>fault detected</Warn>
        uplinkStatus = <Warn>offline</Warn>
      }
      els.push(
        <tr key={ directive.id }>
          <$Title>[{ directive.title }]</$Title>
          <td> - { directiveStatus }</td>
          <td>&nbsp;&nbsp;...&nbsp;&nbsp;</td>
          <td><Button onClick={ directiveCallback }>{ directiveAction }</Button></td>
        </tr>)
    })
  }

  let uplinkCallback = () => {
    dispatch(execStatement({ time: new Date(), input: `uplink` }))
  }

  els.push(
    <tr key={ 'uplink' }>
      <$Title>[FIDO uplink]</$Title>
      <td> - { uplinkStatus }</td>
      <td>&nbsp;&nbsp;...&nbsp;&nbsp;</td>
      <td><Button onClick={ uplinkCallback }>uplink</Button></td>
    </tr>)

  return els
}

export default function Status(props: StatusProps) {
  const [store, dispatch] = useContext(AppContext)

  let authStatus: string
  let authAction: string
  let authCallback: () => void
  let authedElements: ReactNode
  if (store.sessionState.authenticated) {
    authStatus = store.sessionState.user
    authAction = 'logout'
    authCallback = () => {
      dispatch(disconnectSession())
    }
    authedElements = renderAuthedElements(props, dispatch)
  } else {
    authStatus = 'unauthenticated'
    authAction = 'login'
    authCallback = () => {
      dispatch(authenticateSession())
    }
    authedElements = []
  }

  return (
    <table style={{ margin: "20px" }}>
      <tbody>
        <tr>
          <$Title>[authorization]</$Title>
          <td> - { authStatus }</td>
          <td>&nbsp;&nbsp;...&nbsp;&nbsp;</td>
          <td><Button onClick={ authCallback }>{ authAction }</Button></td>
        </tr>
        { authedElements }
      </tbody>
    </table>
  )
}
