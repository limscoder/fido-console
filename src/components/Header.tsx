
import React, { useContext } from 'react'
import styled from 'styled-components'
import { execStatement } from '../store/console/actions'
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
  if (store.userState.authenticated) {
    authUser = store.userState.username
    authText = 'logout'
    authCallback = () => {
      execStatement(dispatch, {time: new Date(), input: 'logout'})
    }
  } else {
    authUser = 'unauthenticated'
    authText = 'login'
    authCallback = () => {
      execStatement(dispatch, {time: new Date(), input: 'login'})
    }
  }

  return (
    <$Header>
      <Highlight>arecibo station debug console</Highlight>
      &nbsp;&nbsp;-&nbsp;&nbsp;
      <span>
        { authUser }&nbsp;
        <Button onClick={ authCallback }>{ authText }</Button>
      </span>
    </$Header>
  )
}