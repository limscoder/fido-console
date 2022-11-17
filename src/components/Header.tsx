import React from 'react'
import styled from 'styled-components'
import Warn from './Warn'
import Highlight from './Highlight'

const $Header = styled.h1`
  font-size: 1em;
  font-weight: normal;
`

export default function Header() {
  return (
    <$Header>
      <Highlight>FIDO auxillary console</Highlight>
      &nbsp;&nbsp;-&nbsp;&nbsp;
      <Warn showIcon>Authorized use only.</Warn>
    </$Header>
  )
}