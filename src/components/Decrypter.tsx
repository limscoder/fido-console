import React, { ReactNode, useCallback, useContext, useState } from 'react'
import { AppContext } from './App'
import Button from './Button'
import styled from 'styled-components'
import { execStatement } from '../store/console/actions'

const cellCount = 25
const colCount = Math.sqrt(cellCount)
const randomizeLimit = 0.50

const $Hbox = styled.div`
  display: flex;
`

interface CellProps {
  cellType: number;
}

const $Cell = styled.div<CellProps>`
  background-color: ${(props) => {
    switch(props.cellType) {
      case 0:
        return '#c4c5c5'
      case 1:
        return '#ff61f2'
      case 2:
        return '#ffe23b'
    }
  }};
  border: 0.1em solid rgb(15, 15, 35);
  height: 3.8em;
  width: 3.8em;
`

const $Grid = styled.div`
  border: 1px dashed;
  display: flex;
  flex-wrap: wrap;
  margin: 1em;
  height: 20em;
  min-height: 20em;
  width: 20em;
  min-width: 20em;
`

interface GridProps {
  cells: Array<number>
  onClick: (i: number) => void
}

interface GridState {
  srcCells: number[]
  gridCells: number[]
  activeCells: number[]
  keyCells: number[]
}

function Grid(props: GridProps) {
  let cells:Array<ReactNode> = []
  props.cells.forEach((c, i) => {
    const onClick = () => {
      props.onClick(i)
    }
    cells.push(<$Cell key={ i } cellType={ c } onClick={ onClick } />)
  })
  
  return <$Grid>{ cells }</$Grid>
}

function generateGridState() {
  const srcCells:Array<number> = []
  const gridCells:Array<number> = []
  const activeCells:Array<number> = []
  const keyCells:Array<number> = []
  for (let i = 0; i < cellCount; i++) {
    let val = 0
    if (Math.random() < randomizeLimit) {
      val = 1
    }

    srcCells.push(val)
    gridCells.push(val)
    activeCells.push(0)
  }

  return { srcCells, gridCells, activeCells, keyCells }
}

function toggleCell(i: number, gridCells: Array<number>) {
  if (gridCells[i]) {
    gridCells[i] = 0
  } else {
    gridCells[i] = 1
  }
}

function toggleGrid(i: number, gridState: GridState) {
  const srcCells = gridState.srcCells
  const gridCells = [ ...gridState.gridCells ]
  const activeCells = [ ...gridState.activeCells ]
  const keyCells = [ ...gridState.keyCells ]
  keyCells.push(i)
  activeCells[i] = 2

  const idx = i + 1
  // clicked
  toggleCell(i, gridCells)

  // top
  if (idx > colCount) {
    toggleCell(i - colCount, gridCells)
  }

  // right
  if (idx % colCount !== 0) {
    toggleCell(i + 1, gridCells)
  }

  // bottom
  if (i + colCount < cellCount) {
    toggleCell(i + colCount, gridCells)
  }

  // left
  if (idx % colCount !== 1) {
    toggleCell(i - 1, gridCells)
  }

  return { srcCells, gridCells, activeCells, keyCells }
}

export default function Decrypter(props: {stationId: string}) {
  const [store, dispatch] = useContext(AppContext)
  const [gridState, setGridState] = useState(generateGridState())
  const onClick = useCallback((i: number) => {
    setGridState(toggleGrid(i, gridState))
  }, [gridState, setGridState])
  const onReset = useCallback(() => {
    setGridState({
      srcCells: gridState.srcCells,
      gridCells: gridState.srcCells,
      activeCells: gridState.srcCells.map(() => 0),
      keyCells: []
    })
  }, [gridState, setGridState])
  const onRegen = useCallback(() => {
    setGridState(generateGridState)
  }, [setGridState])
  const onSubmit = useCallback(() => {
    const alignment = JSON.stringify(gridState.srcCells)
    const key = JSON.stringify(gridState.keyCells)
    dispatch(execStatement({
      time: new Date(),
      input: `transmission decode --station=${props.stationId} --alignment="${alignment}" --key="${key}"`}))
  }, [dispatch, gridState])


  return (
    <div>
      <$Hbox>
        <Grid cells={ gridState.gridCells } onClick={ onClick } />
        <Grid cells={ gridState.activeCells } onClick={ () => null }/>
      </$Hbox>
      <Button onClick={ onReset }>reset</Button>&nbsp;
      <Button onClick={ onRegen }>regen</Button>&nbsp;
      <Button onClick={ onSubmit }>submit</Button><br /><br />
    </div>
  )
}