import * as React from 'react';
import { Link } from 'react-router';
import Canvas from '../babylonjs/Canvas';
import Label from '../shared/Label';
import SettingsClass from '../shared/classes/SettingsClass';

interface Props {
  showSettings: boolean;
  toggleShowSettings: () => void;
  framerate: number;
  animationRatio: number;
  changeSetting: (groupName: string, settingName: string, settingValue: any) => void;
  settings?: SettingsClass;
}

class Settings extends React.Component<Props, {}> {
  render() {
    if (this.props.showSettings) {
      return (
        <div style={{ height: "100%", width: 400, position: "absolute", right: 0, backgroundColor: "grey", opacity: .9 }}>
          <div>
            <h1 style={{textAlign: "center"}}>Settings</h1>
            <button onClick={() => this.props.toggleShowSettings()}>Close</button>
            <Label
              label={<span>On Screen D-Pad</span>}
              control={<input type="checkbox"
              checked={this.props.settings.keyboard.displayOnScreenKeyboard}
              onChange={event => this.props.changeSetting("keyboard", "displayOnScreenKeyboard", !this.props.settings.keyboard.displayOnScreenKeyboard)} />}
            />
            <Label label={"FPS:"}
              control={this.props.framerate}/>
            <Label label={"Animation Ratio:"}
              control={this.props.animationRatio}/>
            <Label label={"Movement Speed:"}
              control={this.props.settings.movementSpeed}/>
            <Label label={"Jump Speed:"}
              control={this.props.settings.jumpSpeed}/>
            <Label
              label={<span>Horizontal Mouse Sensitivity</span>}
              control={<input type="text"
                value={this.props.settings.mouse.mouseSensitivityX}
                onChange={event => this.props.changeSetting("mouse", "mouseSensitivityX", (event.target as HTMLInputElement).value)} />}
            />
            <Label
              label={<span>Vertical Mouse Sensitivity</span>}
              control={<input type="text"
              value={this.props.settings.mouse.mouseSensitivityY}
              onChange={event => this.props.changeSetting("mouse", "mouseSensitivityY", (event.target as HTMLInputElement).value)} />}
            />
            <Label
              label={<span>Sticky Right Mouse Click</span>}
              control={<input type="checkbox"
              checked={this.props.settings.mouse.stickyRightMouseClick}
              onChange={event => this.props.changeSetting("mouse", "stickyRightMouseClick", !this.props.settings.mouse.stickyRightMouseClick)} />}
            />
            <Label
              label={<span>Invert Input X Axis</span>}
              control={<input type="checkbox"
              checked={this.props.settings.mouse.invertX}
              onChange={event => this.props.changeSetting("mouse", "invertX", !this.props.settings.mouse.invertX)} />}
            />
            <Label
              label={<span>Invert Input Y Axis</span>}
              control={<input type="checkbox"
              checked={this.props.settings.mouse.invertY}
              onChange={event => this.props.changeSetting("mouse", "invertY", !this.props.settings.mouse.invertY)} />}
            />
            <Label
              label={<span>Invert Touch Input</span>}
              control={<input type="checkbox"
              checked={this.props.settings.mouse.invertTouch}
              onChange={event => this.props.changeSetting("mouse", "invertTouch", !this.props.settings.mouse.invertTouch)} />}
            />
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export default Settings;
