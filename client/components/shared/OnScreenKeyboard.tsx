import * as React from 'react';
import SettingsClass from './classes/SettingsClass';

interface Props {
  settings: SettingsClass;
  changeSetting: (groupName: string, settingName: string, settingValue: any) => void;
}

class OnScreenKeyboard extends React.Component<Props, {}> {
  keyDown(event, settingName: string) {
    event.preventDefault();
    this.props.changeSetting("keyboard", settingName, true);
  }

  keyUp(event, settingName: string) {
    event.preventDefault();
    this.props.changeSetting("keyboard", settingName, false);
  }

  renderKey(key: string, width: number, height: number) {
    return (
      <div style={{float: "left", height: height, width: width, backgroundColor: "grey"}}
        onTouchStart={(event) => this.keyDown(event, key)}
        onTouchMove={(event) => this.keyDown(event, key)}
        onTouchEnd={this.stop}
        onMouseDown={(event) => this.keyDown(event, key)}
        onMouseUp={(event) => this.keyUp(event, key)}
        onMouseOut={(event) => this.keyUp(event, key)}>
      </div>
    );
  }

  update(event, size) {
    if (event.pageX < size/2.5) {
      if (window.innerHeight - event.pageY < size/2.5) {
        this.props.changeSetting("keyboard", 'z', true);
      }
      else if (window.innerHeight - event.pageY > size - size/2.5) {
        this.props.changeSetting("keyboard", 'q', true);
      }
      else {
        this.props.changeSetting("keyboard", 'a', true);
      }
    }
    else if (event.pageX > size - size/2.5) {
      if (window.innerHeight - event.pageY < size/2.5) {
        this.props.changeSetting("keyboard", 'c', true);
      }
      else if (window.innerHeight - event.pageY > size - size/2.5) {
        this.props.changeSetting("keyboard", 'e', true);
      }
      else {
        this.props.changeSetting("keyboard", 'd', true);
      }
    }
    else {
      if (window.innerHeight - event.pageY < size/2.5) {
        this.props.changeSetting("keyboard", 's', true);
      }
      else if (window.innerHeight - event.pageY > size - size/2.5) {
        this.props.changeSetting("keyboard", 'w', true);
      }
      else {
        this.props.changeSetting("keyboard", 'stop', true);
      }
    }
  }

  move(event, size) {
    event.preventDefault();
    if (event.changedTouches) {
      for (let i = 0; i < event.changedTouches.length; i++) {
        this.update(event.changedTouches[i], size);
      }
    }
    else {
      this.update(event, size);
    }
  }

  stop(event) {
    event.preventDefault();
    this.props.changeSetting("keyboard", 'stop', true);
  }

  render() {
    let min = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;

    if (this.props.settings.keyboard.displayOnScreenKeyboard) {
      return (
      <div>
        <canvas style={{position: "absolute", left: 0, bottom: 0, zIndex: 1, width: min/2, height: min/2}}
          onTouchStart={(event) => this.move(event, min/2)}
          onTouchMove={(event) => this.move(event, min/2)}
          onTouchEnd={this.stop} />
        <div style={{position: "absolute", left: 2*min/10, bottom: 3*min/10}}>
          {this.renderKey("w", min/10, min/10)}
        </div>
        <div style={{position: "absolute", left: min/10, bottom: 2*min/10}}>
          {this.renderKey("a", min/10, min/10)}
        </div>
        <div style={{position: "absolute", left: 3*min/10, bottom: 2*min/10}}>
          {this.renderKey("d", min/10, min/10)}
        </div>
        <div style={{position: "absolute", left: 2*min/10, bottom: min/10}}>
          {this.renderKey("s", min/10, min/10)}
        </div>
        <div style={{position: "absolute", left: window.innerWidth/4, bottom: 0}}>
          {this.renderKey("space", window.innerWidth/2, min/5)}
        </div>
        <div style={{position: "absolute", right: min/20, bottom: min/20}}>
          {this.renderKey("shift", min/6, min/4)}
        </div>
      </div>
      );
    }
    else {
      return null;
    }
  }
}

export default OnScreenKeyboard;
