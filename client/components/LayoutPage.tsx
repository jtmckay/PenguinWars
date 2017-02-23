import * as React from 'react';

class LayoutPage extends React.Component<{}, {}> {
  render() {
    return (
      <div style={{position: "absolute"}}>
        <div>
        </div>
        <div>
          {this.props.children}
        </div>
        <div>
        </div>
      </div>
    );
  }
}

export default LayoutPage;
