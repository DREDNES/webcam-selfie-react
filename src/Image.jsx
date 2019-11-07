import React from 'react';

export default function Image (props) {
  let source = props.source;

  let style = {
    width: '200px',
    margin: '10px 5px 0px 5px',
    cursor: 'pointer'
  };

  return (
    <div>
      <img alt='' src={source} style={style} onClick={ () => props.open(source) }/>
    </div>
   
  );
};