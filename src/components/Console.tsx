import React, { useContext, useState, useEffect, useRef } from 'react'
import { AppContext } from './App' 
import Icon from './Icon'
import styled from 'styled-components'
import { prevStatement, nextStatement } from '../store/console/actions'
import { execCommand } from '../store/command'

function Status(props: {time: Date}) {
  const t = props.time
  const timestamp = [t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds()].map((v: number) => {
      const l = v.toString();
      if (l.length === 1) {
          return "0" + l;
      }
      return l;
  }).join(':');
  return <div>---- { timestamp }</div> 
}

const $Caret = styled.span`
  width: 1.25em;
`

function Caret(props: {busy: boolean}) {
  if (props.busy) {
    return <$Caret><Icon id="spin" /></$Caret>
  }
  return <$Caret>&gt;</$Caret>
}

const $Input = styled.div`
  display: flex;
  width: 100%;
`

const $TextBox = styled.span`
    appearance: none;
    background: transparent;
    border: none;
    color: inherit;
    outline: none;
    overflow-wrap: anywhere;
    flex-grow: 1;
`

interface InputProps {
  cmd: string
  busy: boolean
  onExec(cmd: string): any
  onNext(): any
  onPrev(): any
}

function Input(props: InputProps) {
  
  const textEl = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!props.busy && props.cmd === '' && textEl?.current?.innerHTML !== '') {
      // clear text input
      if (textEl?.current) {
        textEl.current.innerHTML = ''
      }
    }

    // auto-focus the text input
    let interval = window.setInterval(() => {
        if (document.activeElement !== textEl?.current) {
            textEl?.current?.focus();
        }
    }, 300);
    return () => window.clearInterval(interval);
  });

  // detect key events
  const onKeydown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (props.busy) {
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      props.onExec(textEl.current?.innerHTML || '')
      if (textEl && textEl.current) {
        // textEl.current.innerHTML = ''
      }
    } else if (e.key === 'ArrowUp') {
      props.onPrev()
    } else if (e.key === 'ArrowDown') {
      props.onNext()
    }
  }

  return (
    <$Input>
      <Caret busy={ props.busy } />
      <$TextBox ref={ textEl }
                role="textbox"
                children={ props.cmd }
                onKeyDown={ onKeydown }
                spellCheck={ false }
                contentEditable={ !props.busy }
                suppressContentEditableWarning />
    </$Input>
  )
}

export default function Console() {
  const [state, dispatch] = useContext(AppContext)
  const onExec = (input: string) => {
    execCommand(dispatch, {time: state.consoleState.stmt.time, input})
  }
  const onPrev = () => {
    dispatch(prevStatement())
  }
  const onNext = () => {
    dispatch(nextStatement())
  }

  const results = state.consoleState.results.map((v, i) => {
    return (
      <React.Fragment key={ i }>
        <Status time={ v.stmt.time } />
        <$Input>
          <Caret busy={ false } />
          <$TextBox>{ v.stmt.input }</$TextBox>  
        </$Input>
        { v.output }
      </React.Fragment>
    )
  })
  
  return (
    <div>
      { results }
      <Status time={ state.consoleState.stmt.time } />
      <Input cmd={ state.consoleState.stmt.input }
             busy={ state.consoleState.busy }
             onExec={ onExec }
             onPrev={ onPrev }
             onNext={ onNext } />
    </div>
  )
}
