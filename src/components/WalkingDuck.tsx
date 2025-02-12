import React from 'react';

export function WalkingDuck() {
  return (
    <div className="duck__wrapper">
      <div className="duck">
        <div className="duck duck__inner">
          <div className="duck__mouth"></div>
          <div className="duck__head">
            <div className="duck__eye"></div>
            <div className="duck__eye--shadow"></div>
            <div className="duck__white"></div>
          </div>
          <div className="duck__body"></div>
          <div className="duck__wing"></div>
        </div>
        <div className="duck__foot duck__foot--1"></div>
        <div className="duck__foot duck__foot--2"></div>
        <div className="surface"></div>
      </div>
    </div>
  );
}