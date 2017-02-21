import * as React from 'react';
import * as BABYLON from 'babylonjs';
import Snowman from './Mesh/Snowman';
import Gravitator from './Gravitator';
import guid from '../../functions/guid';

interface Props {
  scene: BABYLON.Scene;
  gravitator: Gravitator;
  addShadows: (mesh) => void;
  assetsManager: BABYLON.AssetsManager;
  level: number;
}

class Survival extends React.Component<Props, {}> {
  constructor(props) {
    super(props);

    this.snowmen = [
      {startPosition: new BABYLON.Vector3(50, 0, 0), target: new BABYLON.Vector3(0, 0, 0)},
    ];
  }
  snowmen: Array<{startPosition: BABYLON.Vector3,target: BABYLON.Vector3}>;

  componentDidMount() {
  }

  componentWillReceiveProps() {

  }

  render() {
    return (
      <div>
        {this.snowmen.map(i => {
          return <Snowman key={guid()}
            gravitator={this.props.gravitator}
            scene={this.props.scene}
            addShadows={this.props.addShadows}
            assetsManager={this.props.assetsManager}
            startPosition={i.startPosition}
            target={i.target} />
        })}
      </div>
    );
  }
}

export default Survival;
