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
    this.props.nodeTypeHandler(this.props.wandType, {x:this.props.col, y:this.props.row})
    this.setState({type: this.props.wandType,})
    this.styleNode();
  }

  styleNode(){
    if(this.props.style !== undefined){
      return this.props.style;
    }else{
      return {};
    }
  }

  //toggles mouse up down variable
  handleMouseEvent = (event) => {
    if(event.type === "mousedown"){
      this.props.toggleMouseState(true)
    }else{
      this.props.toggleMouseState(false)
    }
  }

  render() {
    return (
      <div 
        id={`${this.props.row}_${this.props.col}`}
        onMouseEnter={() => {if(this.props.isMouseDown){this.changeNodeType()}}}
        onMouseDown={(e) => {
          this.handleMouseEvent(e)
          this.changeNodeType()
        }} 
        onMouseUp={(e) => this.handleMouseEvent(e)}
        className="node"
        style={this.styleNode()}
      ></div>
    )
  }
}