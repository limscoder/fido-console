import React, { ReactNode } from 'react'
import styled from 'styled-components'

type TableProps = {
  header: Array<ReactNode>
  rows: Array<Array<ReactNode>>
}

const $table = styled.table`
  border-collapse: collapse;
  margin: 1em;
`

const $th = styled.th`
  font-weight: normal;
  border: 1px dashed;
  padding: 0.35em;
`

const $td = styled.td`
  border: 1px dashed;
  padding: 0.35em;
`

export default function Table(props: TableProps) {
  return (
    <$table>
      <thead>
        <tr>
          { props.header.map((h: ReactNode, i: number) => <$th key={ i }>{ h }</$th>)}
        </tr>
      </thead>
      <tbody>
        { props.rows.map((r: ReactNode[], i: number) => <tr key={ i } >{ r.map((c: ReactNode, i: number) => <$td key={ i }>{ c }</$td>) }</tr>)}
      </tbody>
    </$table>
  )
}