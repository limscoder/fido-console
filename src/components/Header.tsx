import React, { useContext } from 'react'
import styled from 'styled-components'
import { authenticateSession, disconnectSession } from '../store/session/actions'
import { AppContext } from './App'
import Button from './Button'
import Highlight from './Highlight'

const $Header = styled.h1`
  font-size: 1em;
  font-weight: normal;
`

export default function Header() {
  const [store, dispatch] = useContext(AppContext)

  let authUser: string
  let authText: string
  let authCallback: () => void
  if (store.sessionState.authenticated) {
    authUser = store.sessionState.user
    authText = 'logout'
    authCallback = () => {
      dispatch(disconnectSession())
    }
  } else {
    authUser = 'unauthenticated'
    authText = 'login'
    authCallback = () => {
      dispatch(authenticateSession())
    }
  }

  return (
    <$Header>
      <Highlight>arecibo auxillary control console</Highlight>
      &nbsp;&nbsp;-&nbsp;&nbsp;
      <span>
        { authUser }&nbsp;
        <Button onClick={ authCallback }>{ authText }</Button>
      </span>
    </$Header>
  )
}