import * as React from 'react';
import { Link } from 'react-router';
import Canvas from '../babylonjs/Canvas';
import Settings from './Settings';

interface State {
  showSettings?: boolean;
  animationRatio?: number;
  framerate?: number;
  settings?: {
    movementSpeed: number;
    jumpSpeed: number;
    mouseSensitivity: number;
    stickyRightMouseClick: boolean;
  };
}

class HomePage extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state ={
      showSettings: false,
      animationRatio: 1,
      settings: {
        movementSpeed: 200,
        jumpSpeed: 400,
        mouseSensitivity: 5,
        stickyRightMouseClick: false
      }
    };

    this.animationRatios = [];
    this.averageAnimationRatio = 1;

    this.keyDown = this.keyDown.bind(this);
    this.changeSetting = this.changeSetting.bind(this);
  }

  averageAnimationRatio: number;
  animationRatios: Array<number>;

  keyDown(event) {
    if (event.key == 'Escape') {
      this.setState({showSettings: !this.state.showSettings});
    }
  }

  changeSetting(settingName: string, settingValue: any) {
    let newSetting = {};
    newSetting[settingName] = settingValue;
    this.setState({ settings: Object.assign({}, this.state.settings, newSetting)});
  }

  render() {
    return (
      <div onKeyDown={this.keyDown}>
        <Settings framerate={this.state.framerate}
          animationRatio={this.state.animationRatio}
          settings={this.state.settings}
          changeSetting={this.changeSetting}
          showSettings={this.state.showSettings} />
        <Canvas settings={this.state.settings}
          animationRatio={this.state.animationRatio}
          setAnimationRatio={(ratio: number) => {
            this.animationRatios.push(ratio);
            if (this.animationRatios.length >= 100) {
              this.averageAnimationRatio = this.animationRatios.reduce((a, b) => { return a+b; })/this.animationRatios.length;
              this.setState({animationRatio: this.averageAnimationRatio});
              this.animationRatios.length = 0;
            }
            else {
              if (ratio < this.state.animationRatio && ratio > this.state.animationRatio + 1) {
                this.setState({animationRatio: ratio});
              }
              else {
                this.setState({animationRatio: this.averageAnimationRatio});
              }
            }
          }}
          setFramerate={(fps: number) => this.setState({framerate: fps }) } />
      </div>
    );
  }
}

export default HomePage;
