import * as React from 'react';
import * as BABYLON from 'babylonjs';
import { Link } from 'react-router';
import Canvas from '../../functions/babylonjs/Canvas';

interface State {
  showSettings?: boolean;
  showKeyboard?: boolean;
}

class HomePage extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.canvas = new Canvas(() => this.setState({}));
  }
  canvas: Canvas;

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
        {this.canvas && this.canvas.character && this.canvas.character.characterHealth <= 0
        ?
          <div style={{textAlign: "center", position: "absolute", backgroundColor: "white", opacity: .8, width: "100%", height: "100%"}}>
            <br />
            <br />
            <h1>You're frozen!</h1>
            <br />
            <h2>GG</h2>
            <br />
            <h2>{this.canvas.killCount} meltings</h2>
            <br />
            <a href="#" onClick={() => location.reload()}>Restart</a>
          </div>
        :
          null
        }
      </div>
    );
  }
}

export default HomePage;
