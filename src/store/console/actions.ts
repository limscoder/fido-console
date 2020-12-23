import { Command } from "./reducer"

export const RECEIVE_INPUT = 'RECEIVE_INPUT'
export function receiveInput(command: Command) {
    return {
        type: RECEIVE_INPUT,
        payload: command
    } as const
}

export const NEXT_COMMAND = 'NEXT_COMMAND'
export function nextCommand() {
    return {
        type: NEXT_COMMAND,
        payload: undefined
    } as const
}

export const PREV_COMMAND = 'PREV_COMMAND'
export function prevCommand() {
    return {
        type: PREV_COMMAND,
        payload: undefined
    } as const
}

export type ConsoleAction = ReturnType<typeof receiveInput> | ReturnType<typeof nextCommand> | ReturnType<typeof prevCommand>