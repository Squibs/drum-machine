import React, { useState } from 'react';
import styled from 'styled-components';

/* All credit goes to Daniel Subat on codepen. https://codepen.io/bbx/pen/QBKYOy */
/* I only translated what he has created into React functional components with typescript
   and modified what he as created down to only the things that I am using */

/* --------------------------------- styles --------------------------------- */

const KnobWithStyles = styled.div`
  display: flex;
  position: relative;
`;

const KnobOuter = styled.div`
  border-radius: 50%;
  border: 1px solid #222;
  border-bottom: 5px solid #222;
  background-image: radial-gradient(100% 70%, #666 6%, #333 90%);
  box-shadow: 0 5px 12px 2px black, 0 0 5px 3px black, 0 0 0 8px #444;
  z-index: 2;
`;

const KnobInner = styled.div`
  border-radius: 50%;
`;

const KnobGrip = styled.div`
  position: absolute;
  width: 5%;
  height: 30%;
  bottom: 2%;
  left: 50%;
  transform: translateX(-50%);
  background: #509eec;
  box-shadow: 0 0 3px 1px black;
`;

const KnobTicks = styled.div`
  position: absolute;

  & div {
    position: absolute;
    background: black;
    box-shadow: inset 0 0 0 0 black;
    width: 3px;
    transition: box-shadow 0.5s;

    &.active {
      box-shadow: inset 0 0 5px 2px #509eec, 0 0 0 1px #369;
    }
  }
`;

/* ---------------------------------- types --------------------------------- */

type KnobProps = {
  degrees: number;
  min: number;
  max: number;
  value: number;
  size: number;
};

/* -------------------------------- component ------------------------------- */

const Knob = ({ degrees, min, max, value, size }: KnobProps) => {
  const convertRange = (
    oldMin: number,
    oldMax: number,
    newMin: number,
    newMax: number,
    oldValue: number,
  ) => {
    return ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
  };

  const startAngle = (360 - degrees) / 2;
  const endAngle = startAngle + degrees;
  let currentDeg = Math.floor(convertRange(min, max, startAngle, endAngle, value));

  const [deg, setDeg] = useState<number>(currentDeg);

  const getDeg = (clientX: number, clientY: number, pts: { x: number; y: number }) => {
    const x = clientX - pts.x;
    const y = clientY - pts.y;
    let d = (Math.atan(y / x) * 180) / Math.PI;

    if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
      d += 90;
    } else {
      d += 270;
    }

    return Math.min(Math.max(startAngle, d), endAngle);
  };

  const startDrag = (event: React.MouseEvent) => {
    event.preventDefault();

    const target = event.target as Element;
    const knob = target.getBoundingClientRect();
    const pts = {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2,
    };

    const moveHandler = (e: MouseEvent) => {
      currentDeg = getDeg(e.clientX, e.clientY, pts);
      if (currentDeg === startAngle) currentDeg -= 1;
      setDeg(currentDeg);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', moveHandler);
    });
  };

  const renderTicks = () => {
    const numTicks = 38; // number of ticks
    const ticks = [];
    const incr = degrees / (numTicks - 1);
    const tSize = size * 0.15 + size / 2;

    for (let tDeg = startAngle; tDeg <= endAngle; tDeg += incr) {
      const tick = {
        id: `${tDeg}`,
        deg: tDeg,
        tickStyle: {
          height: tSize + 10,
          left: tSize - 16,
          top: tSize - 15,
          transform: `rotate(${tDeg}deg)`,
          transformOrigin: 'top',
          zIndex: 1,
        },
      };

      ticks.push(tick);
    }

    return ticks.map((tick) => (
      <div
        key={tick.id}
        className={`tick${tick.deg <= deg ? ' active' : ''}`}
        style={tick.tickStyle}
        aria-hidden
      />
    ));
  };

  const duplicateCopy = (o: { width: number; height: number }) => {
    return JSON.parse(JSON.stringify(o));
  };

  const knobStyle = {
    width: size,
    height: size,
  };

  const innerStyle = duplicateCopy(knobStyle);
  const outerStyle = duplicateCopy(knobStyle);

  innerStyle.transform = `rotate(${deg}deg)`;

  return (
    <KnobWithStyles className="knob" style={knobStyle}>
      <KnobTicks>{renderTicks()}</KnobTicks>
      <KnobOuter
        role="slider"
        aria-valuenow={deg}
        className="knob outer"
        style={outerStyle}
        onMouseDown={startDrag}
        tabIndex={0}
      >
        <KnobInner className="knob inner" style={innerStyle}>
          <KnobGrip className="grip" />
        </KnobInner>
      </KnobOuter>
    </KnobWithStyles>
  );
};

/* -------------------- default props / queries / exports ------------------- */

export default Knob;
