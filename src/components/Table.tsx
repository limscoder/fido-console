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
        { props.header.map((h: ReactNode) => <$th>{ h }</$th>)}
      </thead>
      <tbody>
        { props.rows.map((r: ReactNode[]) => <tr>{ r.map((i: ReactNode) => <$td>{ i }</$td>) }</tr>)}
      </tbody>
    </$table>
  )
}