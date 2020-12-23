import React, { useEffect, useRef, useState } from 'react';
import './Input.css';

function formatDate(d: Date) {
    const time = [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()];
    return time.map((t: number) => {
        const l = t.toString();
        if (l.length === 1) {
            return "0" + l;
        }
        return l;
    }).join(':');
}

interface History {
    time: Date,
    cmd: string
}

function Input() {
    const inputEl = useRef<HTMLSpanElement>(null);
    const [time, setTime] = useState(new Date());
    const [history, setHistory] = useState<Array<History>>([]);
    const [historyIdx, setHistoryIdx] = useState<number>(-1);

    // auto-focus the text input
    useEffect(() => {
        let interval = window.setInterval(() => {
            if (document.activeElement !== inputEl?.current) {
                inputEl?.current?.focus();
            }
        }, 300);
        return () => window.clearInterval(interval);
    });

    const onKeydown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            const cmd = inputEl?.current?.innerHTML || "";
            setTime(new Date());
            if (cmd !== "") {
                setHistory(history.concat([{
                    time: time,
                    cmd: cmd
                }]));   
                if (inputEl && inputEl.current) {
                    inputEl.current.innerHTML = '';
                }
                window.scrollTo(0, document.body.scrollHeight);
            }
        } else if (e.key === 'ArrowUp') {
            const prevIdx = historyIdx === -1 ? history.length - 1 : historyIdx - 1;
            if (prevIdx > -1) {
                setHistoryIdx(prevIdx);
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIdx !== -1) {
                const nextIdx = historyIdx === history.length - 1 ? -1 : historyIdx + 1;
                setHistoryIdx(nextIdx);
            }
        }
    };
    const historyLines = history.map((h, idx) => {
        return (
            <React.Fragment key={ idx }>
                <div className="Console-input-info">----- { formatDate(h.time) }</div>
                <div className="Console-input-line">
                    <span className="Console-input-caret">&gt;</span>&nbsp;
                    <span className="Console-input-input">{ h.cmd }</span>
                </div>
            </React.Fragment>
        )
    })
    historyLines.push(
        <React.Fragment key="active-command">
            <div className="Console-input-info">----- { formatDate(time) }</div>
            <div className="Console-input-line">
                <span className="Console-input-caret">&gt;</span>&nbsp;
                <span className="Console-input-input" ref={ inputEl } onKeyDown={ onKeydown }
                      role="textbox" contentEditable suppressContentEditableWarning
                      children={ historyIdx > -1? history[historyIdx].cmd : "" } />
            </div>
        </React.Fragment>
    );

    return (    
        <div className="Console-input">
            { historyLines }
        </div>
    )
}

export default Input