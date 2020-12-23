import React, { useState, useEffect } from 'react';

const animation = ['◐', '◓', '◑', '◒'];

function Spin() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const intervalID = setInterval(() => {
      setFrame(frame => frame + 1);
    }, 300);
    return () => clearInterval(intervalID);
  }, []);

  return (
    <span className="Console-highlight">{ animation[frame % animation.length] }</span>
  );
}

function Complete() {
  return <span className="Console-ok">◈</span>
}

function Fail() {
  return <span className="Console-warn">◬</span>
}

interface IconProps {
  id?: "complete" | "fail" | "spin";
}

function Icon({id = 'spin'}: IconProps) {
  if (id === 'complete') {
    return <Complete />;
  } else if (id === 'fail') {
    return <Fail />
  }

  return <Spin />
}

export default Icon;