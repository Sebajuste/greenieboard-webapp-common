
import { useEffect, useRef, useState } from 'react';
import planeImage from './f18-1024x404.png';

import './lsods.scss';


const PLANE_IMAGE_SETTINGS = {
  with: 102,
  height: 40,
}


export const H = 0x01;

interface PlanePosition {
  x: number,
  y: number
}

export function LSODS({ planeScale = 1, helper = false, onPositionChanged }: { planeScale?: number, helper?: boolean, onPositionChanged?: (position: { x: number, y: number }) => void }) {

  const svgRef = useRef(null);

  const [position, setPosition] = useState<null | PlanePosition>(null);

  const onTouchStart = (e: any) => {

  };

  const onTouchEnd = (e: any) => {
    e.preventDefault();

    const el = svgRef.current as any;
    const rect = el.getBoundingClientRect();

    const x = (e.changedTouches[0].clientX - rect.left) - PLANE_IMAGE_SETTINGS.with / 2; //x position within the element.
    const y = (e.changedTouches[0].clientY - rect.top) - PLANE_IMAGE_SETTINGS.height / 2;  //y position within the element.

    setPosition({ x: x, y: y });

    if (onPositionChanged) onPositionChanged({
      x: (e.changedTouches[0].clientX - rect.left) / rect.width,
      y: (e.changedTouches[0].clientY - rect.top) / rect.height
    });

  }

  const onTouchMove = (e: any) => {

    e.preventDefault();

    const el = svgRef.current as any;
    const rect = el.getBoundingClientRect();

    const x = (e.changedTouches[0].clientX - rect.left) - PLANE_IMAGE_SETTINGS.with / 2; //x position within the element.
    const y = (e.changedTouches[0].clientY - rect.top) - PLANE_IMAGE_SETTINGS.height / 2;  //y position within the element.

    setPosition({ x: x, y: y });

  };

  const onClick = (e: any) => {
    e.preventDefault();

    const el = svgRef.current as any;
    const rect = el.getBoundingClientRect();

    const x = (e.clientX - rect.left) - PLANE_IMAGE_SETTINGS.with / 2; //x position within the element.
    const y = (e.clientY - rect.top) - PLANE_IMAGE_SETTINGS.height / 2;  //y position within the element.

    setPosition({ x: x, y: y });

    if (onPositionChanged) onPositionChanged({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });

  };

  const helpBoxes =
    helper ? (
      <g id="help" >
        <rect width="30" height="20" x="185" y="140" stroke="green" fill="transparent"></rect>
        <rect width="60" height="40" x="170" y="130" stroke="yellow" fill="transparent"></rect>
        <rect width="90" height="60" x="155" y="120" stroke="orange" fill="transparent"></rect>
      </g >
    ) : null;

  return (
    <div className='lsods' onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchStart={onTouchStart} onClick={onClick}>
      {position ? <img src={planeImage} className='plane' alt="Plane position" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${planeScale})` }} /> : null}

      <svg ref={svgRef} viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"  >

        <g id="deck">
          <line x1="0" y1="230" x2="400" y2="230" stroke="black"></line>
          <rect width="400" height="70" x="0" y="230" fill="grey"></rect>
          <polygon points="185,230 100,300 300,300 215,230" fill="white" />
        </g>

        <g id="center-line">
          <line x1="200" y1="0" x2="200" y2="140" stroke="black" ></line>
          <line x1="200" y1="300" x2="200" y2="160" stroke="black" ></line>
        </g>

        <g id="glideslope">
          <line x1="0" y1="150" x2="185" y2="150" stroke="black"></line>
          <line x1="400" y1="150" x2="215" y2="150" stroke="black"></line>
        </g>

        {helpBoxes}

      </svg>

    </div>
  )

}
