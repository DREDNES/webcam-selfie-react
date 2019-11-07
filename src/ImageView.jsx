import React from 'react';
import Close from './assets/icons/close.svg';
import Save from './assets/icons/save.svg';
import Delete from './assets/icons/delete.svg';

export default function ImageView(props) {
  let source = props.source;

  function download() {
    const link = document.createElement('a');
    link.setAttribute('href', source);
    link.setAttribute('download', 'selfie.jpg');
    link.click();
  }

  return (
    <div>
      <div className="ImageView">
        <img alt="" src={source} style={{ maxWidth: '600px' }} />
      </div>
      <div className="closeImageView">
        <input alt="" type="image" onClick={() => props.close()} src={Close} />
      </div>
      <div className="actionsImageView">
        <input
          alt=""
          type="image"
          style={{ backgroundColor: '#6fff36' }}
          onClick={() => download()}
          src={Save}
        />
        <input
          alt=""
          type="image"
          style={{ backgroundColor: '#ff5c36' }}
          onClick={() => props.delete()}
          src={Delete}
        />
      </div>
    </div>
  );
}
