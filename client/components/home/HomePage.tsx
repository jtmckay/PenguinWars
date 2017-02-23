import * as React from 'react';
import * as BABYLON from 'babylonjs';
import { Link } from 'react-router';
import Canvas from '../../functions/babylonjs/Canvas';

interface State {
  showSettings?: boolean;
  animationRatio?: number;
}

class HomePage extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state ={
      showSettings: false,
      animationRatio: 1,
    };

    this.keyDown = this.keyDown.bind(this);
    this.changeSetting = this.changeSetting.bind(this);

    this.canvasOptions = Canvas();
  }
  canvasOptions;

  keyDown(event) {
    if (event.key == 'Escape') {
      this.setState({showSettings: !this.state.showSettings});
    }
  }

  changeSetting(groupName: string, settingName: string, settingValue: any) {
    let newGroup = {};
    let newSetting = {};
    newSetting[settingName] = settingValue;
    if (groupName == "keyboard") {
      if (settingValue == true) {
        if (settingName == 'q') {
          newSetting['w'] = true;
          newSetting['a'] = true;
          newSetting['s'] = false;
          newSetting['d'] = false;
        }
        if (settingName == 'e') {
          newSetting['w'] = true;
          newSetting['a'] = false;
          newSetting['s'] = false;
          newSetting['d'] = true;
        }
        if (settingName == 'z') {
          newSetting['w'] = false;
          newSetting['a'] = true;
          newSetting['s'] = true;
          newSetting['d'] = false;
        }
        if (settingName == 'c') {
          newSetting['w'] = false;
          newSetting['a'] = false;
          newSetting['s'] = true;
          newSetting['d'] = true;
        }
        if (settingName == 'w') {
          newSetting['a'] = false;
          newSetting['s'] = false;
          newSetting['d'] = false;
        }
          if (settingName == 's') {
            newSetting['w'] = false;
            newSetting['a'] = false;
            newSetting['d'] = false;
          }
        if (settingName == 'a') {
          newSetting['d'] = false;
          newSetting['w'] = false;
          newSetting['s'] = false;
        }
        if (settingName == 'd') {
          newSetting['a'] = false;
          newSetting['w'] = false;
          newSetting['s'] = false;
        }
        if (settingName == "stop") {
          newSetting['w'] = false;
          newSetting['a'] = false;
          newSetting['s'] = false;
          newSetting['d'] = false;
        }
      }
    }
  }

  render() {
    return (
      <div onKeyDown={this.keyDown}>
      </div>
    );
  }
}

export default HomePage;
