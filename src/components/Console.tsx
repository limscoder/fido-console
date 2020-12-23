import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from './App' 
import styled from 'styled-components'
import { prevCommand, nextCommand, receiveInput } from '../store/console/actions'
import { CommandResult } from '../store/console/reducer'

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

function Caret() {
  return <span>&gt;&nbsp;</span>
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
  cmd?: string
  onExec(cmd: string): any
  onNext(): any
  onPrev(): any
}

function Input(props: InputProps) {
  // auto-focus the text input
  const textEl = useRef<HTMLSpanElement>(null)
  useEffect(() => {
      let interval = window.setInterval(() => {
          if (document.activeElement !== textEl?.current) {
              textEl?.current?.focus();
          }
      }, 300);
      return () => window.clearInterval(interval);
  });

  // detect key events
  const onKeydown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      props.onExec(textEl.current?.innerHTML || '')
      if (textEl && textEl.current) {
        textEl.current.innerHTML = ''
      }
    } else if (e.key === 'ArrowUp') {
      props.onPrev()
    } else if (e.key === 'ArrowDown') {
      props.onNext()
    }
  }

  return (
    <$Input>
      <Caret />
      <$TextBox ref={ textEl }
                role="textbox"
                children={ props.cmd }
                onKeyDown={ onKeydown }
                spellCheck={ false }
                contentEditable
                suppressContentEditableWarning />
    </$Input>
  )
}

function Output(props: { results: CommandResult[] }) {
  const results = props.results.map((v, i) => {
    switch (v.resultType) {
      case 'history':
        return (
          <React.Fragment key={ i }>
            <Status time={ v.cmd.time } />
            <$Input>
              <Caret />
              <$TextBox>{ v.cmd.input }</$TextBox>  
            </$Input>
          </React.Fragment>
        )
      case 'output':
        return (
          <React.Fragment key={ i }>
            { v.output }
          </React.Fragment>
        )
      default:
        return null
    }
  })
  return <div>{ results }</div>
}

export default function Console() {
  const [state, dispatch] = useContext(AppContext)
  const onExec = (input: string) => {
    dispatch(receiveInput({time: state.consoleState.cmd.time, input}))
  }
  const onPrev = () => {
    dispatch(prevCommand())
  }
  const onNext = () => {
    dispatch(nextCommand())
  }
    
  return (
    <div>
      <Output results={ state.consoleState.results } />
      <Status time={ state.consoleState.cmd.time } />
      <Input cmd={ state.consoleState.cmd.input }
             onExec={ onExec }
             onPrev={ onPrev }
             onNext={ onNext } />
    </div>
  )
}
