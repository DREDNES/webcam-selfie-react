import React from 'react';

export default function Image({ source, open }) {
  let style = {
    width: '200px',
    margin: '10px 5px 0px 5px',
    cursor: 'pointer'
  };

  return (
    <div>
      <img alt="" src={source} style={style} onClick={() => open(source)} />
    </div>
  );
}
