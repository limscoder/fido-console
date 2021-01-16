import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Error from './Error'
import Button from './Button'

type ControlStatus = {
  status: string
  alignment: string
}

type ControlLog = {
  'timestamp': string
  'received'?: string
  'msg'?: string
}

type StatusProps = {
  id: string
  name: string
  control: ControlStatus
  downlink: ControlStatus
  uplink: ControlStatus
  logs: Array<ControlLog>
  onAlign: (id: string, control: string) => void
  onDecode: (id: string) => void
  onReceive: () => void
  onTransmit: () => void
}

type LogsProps = {
  id: string
  control: ControlStatus
  logs: Array<ControlLog>
  onDecode: (id: string) => void
}

type ConnectionProps = {
  control: ControlStatus
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
  padding: 1em;
`

const $log = styled.p`
  margin: 1em;
`

function ControlStatus(props: {control: ControlStatus}) {
  const msg = props.control.status === 'fault' ? 
    <Error showIcon>fault detected</Error> : 
    <span>{ props.control.status }</span>;

  return (
    <span>
      { msg } - { props.control.alignment ? props.control.alignment : 'misaligned' }
    </span>
  )
}

function Connection(props: ConnectionProps) {
  const onClick = () => {}

  let button
  if (props.control.status === 'fault') {
    button = <Button onClick={ onClick }>realign</Button>
  }

  return (
    <React.Fragment>
      Downlink connection { button }:<br />&nbsp;&nbsp;<ControlStatus control={ props.control } />
    </React.Fragment>
  )
}

function Logs(props: LogsProps) {
  const onDecode = useCallback(() => {
    props.onDecode(props.id)
  }, [props.id])
  const logMsgs = props.logs.map((l, i) => {
    return (
      <React.Fragment key={ i }>
        { l.timestamp }-
        <$log>
          { l.received ?
            <span>received encoded transmission <Button onClick={ onDecode }>{ l.received }</Button></span> :
            l.msg }
        </$log>
      </React.Fragment>
    )
          })

  return (
    <div>
      <br />
      logs
      <hr />
      { logMsgs }
    </div>
  )
}

export default function Status(props: StatusProps) {
  const [showLogs, setShowLogs] = useState(false)
  // const onDownlink = () => {
  //   props.onAlign(props.id, 'downlink')
  // }
  const onUplinkAlign = () => { props.onAlign(props.id, 'uplink') }

  return (
    <$card>
      <$header>{ props.id }</$header>
      <$content>
        Station:<br />&nbsp;&nbsp;{ props.name }<br /><br />
        <Connection control={ props.downlink } /><br /><br />
        Uplink connection <Button onClick={ onUplinkAlign }>realign</Button>:<br />&nbsp;&nbsp;<ControlStatus control={ props.uplink } /><br /><br />
        {/* <Button onClick={ props.onReceive }>receive signal</Button>&nbsp; */}
        <Button onClick={ props.onTransmit }>transmit signal</Button>&nbsp;
        <Button onClick={ () => { setShowLogs(!showLogs) } }>{ showLogs ? 'hide transmission logs' : 'show transmission logs' }</Button>
        <br />
        { showLogs ? <Logs id={ props.id }
                           control={ props.downlink }
                           logs={ props.logs }
                           onDecode={ props.onDecode } /> : null}
      </$content>
    </$card>
  )
}