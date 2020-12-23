import React, { useState, useEffect } from 'react';
import './Console.css';
import Icon from './Icon';
import Input from './Input';

const initStages = [
  {
    'timeout': 1,
    'prompt': <p key="prompt-1">&nbsp;&nbsp;<Icon id="spin" /> initializing bastion connection...</p>,
    'response': <p key="response-1">&nbsp;&nbsp;<Icon id="complete" /> connected to bastion 198.51.100.251:8875<br /></p>,
    'waitForResponse': true,
  }
//   }, {
//     'timeout': 10000,
//     'prompt': <p key="prompt-2">&nbsp;&nbsp;<Icon id="spin" /> initializing control uplink...</p>,
//     'response': <p key="response-2">&nbsp;&nbsp;<Icon id="fail" /> <span className="Console-warn">[{ new    Date().toISOString() }] control uplink failed -- unauthorized access prohibited</span></p>,
//     'waitForResponse': true,
//   },
]

function Console() {
  const [stages, setStages] = useState([initStages[0]])
  const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    const stageIdx = stages.length - 1;
    const currentStage = stages[stageIdx];
    if (currentStage['waitForResponse']) {
      const timeout =  Math.floor(Math.random() * Math.floor(currentStage['timeout']));
      const timeoutID = window.setTimeout(() => {
          setStages(stages => {
            stages[stageIdx]['waitForResponse'] = false;
            const nextIdx = stageIdx + 1;
            const newStages = (nextIdx < initStages.length) ? [initStages[nextIdx]] : [];
            return stages.concat(newStages);
          });
        }, timeout);
      return () => { window.clearTimeout(timeoutID) }
    }

    setShowInput(true);
  }, [stages])

  let input = showInput? <Input /> : null;
  return (
    <div className="Console">
      <div className="Console-output">
        <p className="Console-highlight">
          arecibo station debug console
          <br />
          <br />
        </p>
        { stages.map((stage) => { return stage['waitForResponse'] ? stage['prompt'] : stage['response']; }) }
      </div>
      { input }
    </div>
  );
}

export default Console;