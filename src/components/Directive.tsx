import React, { ReactNode, useCallback, useState } from 'react'
import styled from 'styled-components'
import Button from './Button'
import Highlight from './Highlight'

type Directive = {
  id: string
  title: string
  key?: string
  unlocked: string
  content: string[]
  instructions: string[]
}

type DirectiveProps = {
  directive: Directive
  onUnlock: () => void
}

const $card = styled.div`
  margin: 1em;
`

const $header = styled.div`
  background-color: #c4c5c5;
  border: none;
  color: rgb(15, 15, 35);
  text-align: center;
`

const $content = styled.div`
  border-width: 0 1px 1px 1px;
  border-style: dashed;
  overflow-wrap: anywhere;
  padding: 1em;
`

export default function Status(props: DirectiveProps) {
  const [showDirective, setShowDirective] = useState(false)
  let content:ReactNode[] = []
  if (showDirective || !props.directive.instructions) {
    content = props.directive.content.map((c, i) => {
      return <p key={ i } dangerouslySetInnerHTML={ { __html: c }} />
    })

    if (props.directive.instructions) {
      content.push(<p>validated security key: <Highlight>{ props.directive.key }</Highlight></p>)
    }
  }
  const onShowDirective = useCallback(() => {
    setShowDirective(!showDirective)
  }, [showDirective, setShowDirective])
  
  let activatedLabel:ReactNode
  let showDirectiveButton:ReactNode
  let instructions:ReactNode[] = []
  if (props.directive.instructions) {
    instructions = props.directive.instructions.map((c, i) => {
      return <p key={ i } dangerouslySetInnerHTML={ { __html: c }} />
    })
    if (instructions.length > 0) {
      instructions.unshift(<p>----- command sequence instructions -----</p>)
    }
    activatedLabel = `activated: ${props.directive.unlocked}`
    showDirectiveButton = <Button onClick={ onShowDirective }>{ showDirective ? 'hide directive' : 'show directive' }</Button>
  }
  
  let unlockButton:ReactNode
  if (!props.directive.unlocked) {
    unlockButton = <Button onClick={ props.onUnlock }>unlock</Button>
  }

  return (
    <$card>
      <$header>--- { props.directive.title } ---</$header>
      <$content>
        { activatedLabel }
        { instructions }
        { showDirectiveButton }
        { content }
        { unlockButton }
      </$content>
    </$card>
  )
}