import React from 'react';
import ImageView from './ImageView';
import Image from './Image';
import HomeScreen from './HomeScreen';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";



export default class App extends React.Component {
  
  state = {
    canvas: false,
    stream: null,
    images: [],
    fullScreenPreview: '',
    currentImage: ''
  };

  startVideo() {
    const gotMedia = stream => {
      this.setState({stream});
      const video = document.querySelector('video');
        if ('srcObject' in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream); 
        }
    };
    
      navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
      );

      if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
        navigator.getUserMedia({video: true, audio: false}, gotMedia, err => console.error(err));
      } else {
        navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(gotMedia).catch(err => console.error(err));
      } 
  }

  stopVideo() {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach(track => track.stop());
    }
    this.setState({stream: null});
  }

  capture() {
    if (this.state.stream) {
      const video = document.querySelector('video');
      const width = video.offsetWidth, height = video.offsetHeight;
      const canvas = document.getElementById('capture');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(video, 0, 0, width, height);
      this.setState({canvas: true});
    }
  }

  saveCapture() {
    if (this.state.canvas) {
      this.state.images.push(document.getElementById('capture').toDataURL("image/jpeg"));
      this.setState({canvas: false});
      this.clearCanvas();
    }
  }

  deleteCapture() {
    if (this.state.canvas) {
      this.setState({canvas: false});
      this.clearCanvas();
    }
  }

  clearCanvas() {
    const video = document.querySelector('video');
    const width = video.offsetWidth, height = video.offsetHeight;
    const canvas = document.getElementById('capture');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').clearRect(0, 0, width, height);
  }

  
  previewOpen = (image) => this.setState({fullScreenPreview: image});

  previewDelete = () => {
    const index = this.state.images.indexOf(this.state.fullScreenPreview);
    this.state.images.splice( index, 1 );
    this.previewClose();
  };

  previewClose = () => this.setState({fullScreenPreview: ''});

  deleteAllImages() {
    this.setState({images: []});
  }

  renderButtonsSet() {
    if(this.state.stream && !this.state.canvas) {
      return <div className="Buttons-wrap">
                <button onClick={() => this.capture()}>Selfie!</button> 
                <button onClick={() => this.stopVideo()}>Go back</button>
             </div>
    }
    if(this.state.canvas) {
      return <div className="Buttons-wrap">
              <button onClick={() => this.saveCapture()}>Save</button>  
              <button onClick={() => this.deleteCapture()}>Delete</button>
             </div>
    }
  }

  renderSlider() {
    const viewWidth = window.innerWidth;

    var settingsSlider = {
      infinite: true,
      speed: 500,
      slidesToShow: this.state.images.length < Math.ceil(viewWidth/250) ? this.state.images.length : Math.ceil(viewWidth/250),
      slidesToScroll: 1
    };
  
    let captureWidth;
    if(this.state.images.length * 230 < viewWidth - 50) {
      captureWidth = `${this.state.images.length * 230}px`;
    } else {
      captureWidth = '95%';
    }

    return <div className="captures" style={{width: captureWidth}} >
            <Slider className="slick" {...settingsSlider}>
              {
                 this.state.images.map((image, index) =>            
                   (
                     <Image source={image} open={this.previewOpen}/>
                   )                          
                 )
               }
            </Slider>
            </div>
  }

  render() {
  return (
    <div className="App">
       {this.renderButtonsSet()}
      <header className="App-header">
        <div className="Video-zone">
          {
          this.state.stream 
          ? <div>
              <canvas id="capture" style={{zIndex:15}}></canvas>
              <video width="100%" autoPlay/>
              <div className='boundary'></div>
            </div>
          :<HomeScreen start={() => this.startVideo()}/>
          }
        </div>
      {this.renderSlider()}
      {this.state.fullScreenPreview && 
          <div>
            <ImageView source = {this.state.fullScreenPreview} close={this.previewClose} delete = {this.previewDelete}/>
          </div>
      }
      {
        this.state.images.length !== 0 &&
            <button className='deleteAllBut' onClick={() => this.deleteAllImages()}>Delete all selfies</button> 
      }
      </header>
    </div>
    );
  }
}
