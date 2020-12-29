import React from 'react'
import styled from 'styled-components'
import Icon from './Icon'

const $Warn = styled.span`
    color: #ffe23b;
`

interface WarnProps {
    showIcon?: boolean
    children?: React.ReactNode
}

export default function Warn(props: WarnProps) {
    if (props.showIcon) {
        return <$Warn><Icon id="fail" />&nbsp;{ props.children }</$Warn>
    }
    return <$Warn>{ props.children }</$Warn>
}
