import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      col:props.col,
      row:props.row,
      isStart:props.isStart,
      isEnd:props.isEnd,
      isWall:props.isWall,
    };
  }

  changeNodeType(){
    this.props.nodeTypeHandler('start', {x:this.props.row, y:this.props.col})
    // let type = 'start'
    // let row = this.props.row;
    // let col = this.props.col;

    // console.log(type)
    // switch(type){
    //   case 'start':
    //     this.setState({
    //       isStart:true,
    //       isEnd:false,
    //       isWall:false,
    //     })
    //     break;
    //   case 'end':
    //     this.setState({
    //       isStart:true,
    //       isEnd:false,
    //       isWall:false,
    //     })
    //     break;
    //   case 'wall':
    //     this.setState({
    //       isStart:true,
    //       isEnd:false,
    //       isWall:false,
    //     })
    //     break;
    //   default:
    //     console.log('Trying to change node to invalid node type!')
  
    // }

  }

  render() {
    return (
      <div id={`${this.props.row}_${this.props.col}`} onClick={() => this.changeNodeType()} className="node"></div>
    )
  }
}