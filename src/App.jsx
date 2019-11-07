import React from 'react';
import { debounce } from 'lodash';
import ImageView from './ImageView';
import Image from './Image';
import HomeScreen from './HomeScreen';
import './assets/css/App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

export default class App extends React.Component {
  state = {
    canvas: false,
    stream: null,
    images: [],
    fullScreenPreview: '',
    currentImage: '',
    width: window.innerWidth,
    error: null
  };

  startVideo() {
    const error = err => {
      console.log(err);
      this.setState({ error: err });
    };
    const gotMedia = stream => {
      this.setState({ stream });
      const video = document.querySelector('video');
      if ('srcObject' in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL.createObjectURL(stream);
      }
    };

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
      navigator.getUserMedia({ video: true, audio: false }, gotMedia, error);
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(gotMedia)
        .catch(error);
    }
  }

  stopVideo() {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach(track => track.stop());
    }
    this.setState({ stream: null });
  }

  capture() {
    if (this.state.stream) {
      const video = document.querySelector('video');
      const width = video.offsetWidth,
        height = video.offsetHeight;
      const canvas = document.querySelector('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(video, 0, 0, width, height);
      this.setState({ canvas: true });
    }
  }

  saveCapture() {
    if (this.state.canvas) {
      let images = this.state.images;
      images.push(document.querySelector('canvas').toDataURL('image/jpeg'));
      this.setState({ images });
      this.setState({ canvas: false });
      this.clearCanvas();
    }
  }

  deleteCapture() {
    if (this.state.canvas) {
      this.setState({ canvas: false });
      this.clearCanvas();
    }
  }

  clearCanvas() {
    const video = document.querySelector('video');
    const width = video.offsetWidth,
      height = video.offsetHeight;
    const canvas = document.querySelector('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').clearRect(0, 0, width, height);
  }

  previewOpen = image => this.setState({ fullScreenPreview: image });

  previewDelete = () => {
    const index = this.state.images.indexOf(this.state.fullScreenPreview);
    let images = this.state.images;
    images.splice(index, 1);
    this.setState({ images });
    this.previewClose();
  };

  previewClose = () => this.setState({ fullScreenPreview: '' });

  deleteAllImages() {
    this.setState({ images: [] });
  }

  renderButtonsSet() {
    if (this.state.stream && !this.state.canvas) {
      return (
        <div className="Buttons-wrap">
          <button onClick={() => this.capture()}>Selfie!</button>
          <button onClick={() => this.stopVideo()}>Go back</button>
        </div>
      );
    }
    if (this.state.canvas) {
      return (
        <div className="Buttons-wrap">
          <button onClick={() => this.saveCapture()}>Save</button>
          <button onClick={() => this.deleteCapture()}>Delete</button>
        </div>
      );
    }
  }

  updateDimensions = debounce(
    () => this.setState({ width: window.innerWidth }),
    200
  );

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  renderSlider() {
    const viewWidth = this.state.width;

    const settingsSlider = {
      infinite: true,
      speed: 500,
      slidesToShow:
        this.state.images.length < Math.ceil(viewWidth / 250)
          ? this.state.images.length
          : Math.ceil(viewWidth / 250),
      slidesToScroll: 1
    };

    const captureWidth =
      this.state.images.length * 230 < viewWidth - 50
        ? `${this.state.images.length * 230}px`
        : '95%';

    return (
      <div className="captures" style={{ width: captureWidth }}>
        <Slider className="slick" {...settingsSlider}>
          {this.state.images.map((image, index) => (
            <Image key={index} source={image} open={this.previewOpen} />
          ))}
        </Slider>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        {this.renderButtonsSet()}
        <header className="App-header">
          <div className="Video-zone">
            {this.state.stream ? (
              <div>
                <canvas style={{ zIndex: 15 }}></canvas>
                <video width="100%" autoPlay />
                <div className="boundary"></div>
              </div>
            ) : (
              <HomeScreen
                start={() => this.startVideo()}
                error={this.state.error}
              />
            )}
          </div>
          {this.renderSlider()}
          {this.state.fullScreenPreview && (
            <div>
              <ImageView
                source={this.state.fullScreenPreview}
                close={this.previewClose}
                delete={this.previewDelete}
              />
            </div>
          )}
          {this.state.images.length !== 0 && (
            <button
              className="deleteAllBut"
              onClick={() => this.deleteAllImages()}
            >
              Delete all selfies
            </button>
          )}
        </header>
      </div>
    );
  }
}
