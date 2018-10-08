import * as React from 'react';
import * as BABYLON from 'babylonjs';
import { Link } from 'react-router';
import Canvas from '../../functions/babylonjs/Canvas';
import Label from './Label';

interface State {
  showWelcome?: boolean;
}

class HomePage extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      showWelcome: true
    };

    this.canvas = new Canvas(() => this.setState({}));
  }
  canvas: Canvas;

  renderWelcome() {
    return (
      <div style={{textAlign: "center", position: "absolute", backgroundColor: "white", opacity: .8, width: "100%", height: "100%"}}>
        <div style={{width: 500, marginLeft: "auto", marginRight: "auto"}}>
          <div style={{width: 325, float: "left"}}>
            <Label box="Left Click" description="Throw fire" />
            <Label box="Right Click (Hold)" description="Look around" />
            <Label box="Space" description="Jump" />
            <Label box="Shift" description="Slide (move faster)" />
            <Label box="Double press movement key" description="Dodge" />
            <Label box="Scroll Down" description="Zoom out" />
            <Label box="Scroll Up" description="Zoom in" />
          </div>
          <div style={{width: 175, float: "left"}}>
            <Label box="W" description="Move forward" />
            <Label box="A" description="Strafe left" />
            <Label box="S" description="Strafe right" />
            <Label box="D" description="Move backward" />
          </div>
          <div style={{position: "absolute", top: 350, width: 500}} >
            <a href="#" onClick={event => {
              event.preventDefault();
              this.canvas.runProgram();
              this.setState({showWelcome: false});
            }}>Let's Play!</a>
          </div>
        </div>
      </div>
    );
  }

  renderEndGame() {
    return (
      <div style={{textAlign: "center", position: "absolute", backgroundColor: "white", opacity: .8, width: "100%", height: "100%"}}>
        <br />
        <br />
        <h1>You're frozen!</h1>
        <br />
        <h2>GG</h2>
        <br />
        <h2>{this.canvas.killCount} meltings</h2>
        <br />
        {this.canvas.canRestart
          ?
          <a href="#" onClick={event => {
            event.preventDefault();
            this.canvas.resetProgram();
          }}>Restart</a>
          :
          <a>Game Ending...</a>
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        <div style={{position: "absolute", margin: 5, padding: 5, backgroundColor: "white"}}>
          <div>
            Melt Count: {this.canvas.killCount}
          </div>
          <div>
            Lives: {this.canvas.character.characterHealth}
          </div>
        </div>
        {this.state.showWelcome
          ?
          this.renderWelcome()
          :
          null
        }
        {this.canvas && this.canvas.character && this.canvas.character.characterHealth <= 0
          ?
          this.renderEndGame()
          :
          null
        }
      </div>
    );
  }
}

export default HomePage;
