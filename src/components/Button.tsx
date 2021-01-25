
import React, { ReactNode, MouseEvent, useCallback } from 'react'
import styled from 'styled-components'

const $Button = styled.button`
    background: none;
    border: none;
    font-family: 'SourceCodePro', monospace;
    font-size: 1em;
    padding: 0;
    color: #8bd679;
    text-decoration: none;
    cursor: pointer;
    outline: none;

    &:hover {
      color: #afff9b;
    }
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