import * as React from 'react';

interface Props {
  label: any;
  control: any;
}

class Label extends React.Component<Props, {}> {
  render() {
    return (
      <div style={{ float: "left", padding: 5, width: "100%" }}>
        <div style={{ width: "50%", float: "left" }}>
          {this.props.label}
        </div>
        <div style={{ width: "50%", float: "left" }}>
          {this.props.control}
        </div>
      </div>
    );
  }
}

export default Label;
