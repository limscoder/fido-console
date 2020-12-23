import React, { createContext, useReducer } from 'react'
import styled from 'styled-components'
import Console from './Console'
import { AppAction, AppState, appReducer, initialAppState } from '../store'
import Highlight from './Highlight'

export const AppContext = createContext<[AppState, React.Dispatch<AppAction>]>([initialAppState, () => {}])

const $Header = styled.h1`
  font-size: 1em;
  font-weight: normal;
`

const $App = styled.div`
  background-color: rgb(15, 15, 35);
  color: #c4c5c5;
  font-family: 'SourceCodePro', monospace;
  min-height: 100vh;
  padding: 0.25em 1em;
  text-align: left;
`

export default function App() {
  const store = useReducer(appReducer, initialAppState)
  return (
    <AppContext.Provider value={ store }>
      <$App>
        <$Header><Highlight>arecibo station debug console</Highlight></$Header>
        <Console />
      </$App>
    </AppContext.Provider>
  )
}