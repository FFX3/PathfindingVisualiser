import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
    };
  }

  changeNodeType(){
    this.props.nodeTypeHandler('start', {x:this.props.row, y:this.props.col})
    this.setState({type: 'start',})
    this.styleNode();
  }

  styleNode(){
    switch(this.state.type){
      case 'start':
        return { backgroundColor: 'red' };
      case 'end':
        return {}
      case 'wall':
        return {}
      default:
        return {};
    }
  }

  render() {
    return (
      <div 
        id={`${this.props.row}_${this.props.col}`}
        onClick={() => this.changeNodeType()}
        className="node"
        style={this.styleNode()}
      ></div>
    )
  }
}