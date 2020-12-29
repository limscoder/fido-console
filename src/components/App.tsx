import React, { createContext } from 'react'
import useThunkReducer from 'react-hook-thunk-reducer'
import styled from 'styled-components'
import Console from './Console'
import { AppAction, AppState, appReducer, initialAppState } from '../store'
import Header from './Header'

export const AppContext = createContext<[AppState, React.Dispatch<AppAction>]>([initialAppState, () => {}])

const $App = styled.div`
  background-color: rgb(15, 15, 35);
  color: #c4c5c5;
  font-family: 'SourceCodePro', monospace;
  min-height: 100vh;
  padding: 0.25em 1em;
  text-align: left;
`

export default function App() {
  const store = useThunkReducer(appReducer, initialAppState)
  return (
    <AppContext.Provider value={ store }>
      <$App>
        <Header />
        <Console />
      </$App>
    </AppContext.Provider>
  )
}