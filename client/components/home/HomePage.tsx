import * as React from 'react';
import * as BABYLON from 'babylonjs';
import { Link } from 'react-router';
import Canvas from '../babylonjs/Canvas';
import Settings from '../settings/Settings';
import SettingsClass from '../shared/classes/SettingsClass';
import OnScreenKeyboard from '../shared/OnScreenKeyboard';

interface State {
  showSettings?: boolean;
  animationRatio?: number;
  framerate?: number;
  settings?: SettingsClass;
}

class HomePage extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state ={
      showSettings: true,
      animationRatio: 1,
      settings: new SettingsClass()
    };

    this.keyDown = this.keyDown.bind(this);
    this.changeSetting = this.changeSetting.bind(this);
  }

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
    newGroup[groupName] = Object.assign({}, this.state.settings[groupName], newSetting);
    this.setState({ settings: Object.assign({}, this.state.settings, newGroup)});
  }

  render() {
    return (
      <div onKeyDown={this.keyDown}>
        <OnScreenKeyboard settings={this.state.settings}
          changeSetting={this.changeSetting} />
        <Settings framerate={this.state.framerate}
          animationRatio={this.state.animationRatio}
          settings={this.state.settings}
          toggleShowSettings={() => this.setState({showSettings: !this.state.showSettings})}
          changeSetting={this.changeSetting}
          showSettings={this.state.showSettings} />
        <Canvas settings={this.state.settings}
          invertMouse={() => this.setState({ settings:
            Object.assign({}, this.state.settings,
              {mouse: Object.assign({}, this.state.settings.mouse,
                {mouseSensitivityX: -this.state.settings.mouse.mouseSensitivityX,
                  mouseSensitivityY: -this.state.settings.mouse.mouseSensitivityY})})})}
          setFramerate={(fps: number, animationRatio: number) =>
            this.setState({framerate: fps, animationRatio: animationRatio }) } />
      </div>
    );
  }
}

export default HomePage;
