import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from './App' 
import Icon from './Icon'
import styled from 'styled-components'
import { CommandOption } from '../store/console/reducer'
import { execStatement, prevStatement, nextStatement, clearStatement } from '../store/console/actions'
import { initSession } from '../store/session/actions'

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
  onEnter(cmd: string): any
  onNext(): any
  onPrev(): any
  onClear(): any
}

function alwaysFocusEffect(el: HTMLElement): () => any {
  el.focus()
  const onKeydown = (e: KeyboardEvent) => { 
    if (document.activeElement !== el && !e.altKey && !e.ctrlKey && !e.metaKey) {
      el.focus()
      window.scrollTo(0, document.body.scrollHeight)

      // move caret to end https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
      const range = document.createRange() //Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(el) //Select the entire contents of the element with the range
      range.collapse(false) //collapse the range to the end point. false means collapse to end rather than the start
      const selection = window.getSelection(); //get the selection object (allows you to change selection)
      selection?.removeAllRanges() //remove any selections already made
      selection?.addRange(range) //make the range you have just created the visible selection
    }
  }
  const onKeydownOpts = { capture: true }
  document.addEventListener('keydown', onKeydown, onKeydownOpts)
  return () => { document.removeEventListener('keydown', onKeydown, onKeydownOpts) }
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
    if (!props.busy && textEl?.current) {
      return alwaysFocusEffect(textEl.current)
    }
  });

  // detect key events
  const onKeydown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (props.busy) {
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      props.onEnter(textEl.current?.innerHTML || '')
    } else if (e.key === 'ArrowUp') {
      props.onPrev()
    } else if (e.key === 'ArrowDown') {
      props.onNext()
    } else if (e.key === 'c' && e.ctrlKey) {
      props.onClear()
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

interface PromptProps {
  option: CommandOption
  onEnter(input: string): any
  onClear(): any
}

function Prompt(props: PromptProps) {
  const textEl = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (textEl?.current) {
      return alwaysFocusEffect(textEl.current)
    }
  });

  // detect key events
  const onKeydown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      props.onEnter(textEl.current?.innerHTML || '')
    } else if (e.key === 'c' && e.ctrlKey) {
      props.onClear()
    }
  }

  return (
    <$Input>
      <span>{ props.option?.prompt }&nbsp;</span>
      <$TextBox ref={ textEl }
                key={ props.option.flag }
                role="textbox"
                onKeyDown={ onKeydown }
                spellCheck={ false }
                contentEditable={ true }
                suppressContentEditableWarning />
    </$Input>
  )
}

export default function Console() {
  const [store, dispatch] = useContext(AppContext)
  const stmt = store.consoleState.stmt
  const onExec = (input: string) => {
    dispatch(execStatement({
      time: stmt.time,
      input
    }))
  }
  const onPrev = () => {
    dispatch(prevStatement())
  }
  const onNext = () => {
    dispatch(nextStatement())
  }
  const onClear = () => {
    dispatch(clearStatement())
  }
  const onPrompt = (input: string) => {
    dispatch(execStatement({
      time: stmt.time,
      input: stmt.input.replace(new RegExp(`\\s+~+${stmt.prompt?.flag}`), '') + ` --${stmt.prompt?.flag}=${input}`
    }))
  }
  useEffect(() => {
    if (store.sessionState.cxnId === '') {
      dispatch(initSession())
    }
  }, [store.sessionState]);

  const results = store.consoleState.results.map((v, i) => {
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
      <Status time={ stmt.time } />
      <Input cmd={ stmt.input }
             busy={ stmt.busy || false }
             onEnter={ onExec }
             onPrev={ onPrev }
             onNext={ onNext }
             onClear={ onClear } />
      { stmt.prompt ? <Prompt option={ stmt.prompt } onEnter={ onPrompt } onClear={ onClear } /> : null }
    </div>
  )
}
