import React from 'react';

export default function MainScreen({start}) {
  return (
    <div>
        <h1>Make selfies from your WebCam!</h1>
        <h3>Click Start and allow access to your camera</h3>
        <div className="Buttons-wrap" style={{marginTop: '-1em'}}><button style={{padding: '0.3em 0.8em'}} onClick={() => start()}>START</button></div>
    </div>
  );
};