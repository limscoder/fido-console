
import React, { ReactNode, MouseEvent, useCallback } from 'react'
import styled from 'styled-components'

const $Button = styled.button`
    background: none;
    border: none;
    font-family: 'SourceCodePro', monospace;
    font-size: 1em;
    padding: 0;
    color: #a0fc89;
    text-decoration: none;
    cursor: pointer;
    outline: none;
`

interface ButtonProps {
  onClick(): void
  children?: ReactNode
}

export default function Button(props: ButtonProps) {
  const onClick = useCallback((e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    props.onClick()
  }, [props])

  return (
    <$Button onClick={ onClick }>[{ props.children }]</$Button>
  )
}