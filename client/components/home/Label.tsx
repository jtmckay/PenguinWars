import * as React from 'react';

interface Props {
  box: string;
  description: string;
}

class Label extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{width: "100%", height: 50}}>
        <div style={{height: 20, margin: 10, borderStyle: "solid", float: "left" }}>
          &nbsp;{this.props.box}&nbsp;
        </div>
        <div style={{float: "left", marginTop: 12}}>
          {this.props.description}
        </div>
      </div>
    );
  }
}

export default Label;
