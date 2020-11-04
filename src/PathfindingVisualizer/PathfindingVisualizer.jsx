import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';

//variables
let rows = 15;
let col = 25;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
    };
    this.nodeTypeHandler = this.nodeTypeHandler.bind(this)
  }

  nodeTypeHandler(type, position){
    let newNodeProps = {}
    switch(type){
      case 'start':
        newNodeProps.isStart = true;
        newNodeProps.isEnd = false;
        newNodeProps.isWall = false;
        break;
      case 'end':
        newNodeProps.isStart = false;
        newNodeProps.isEnd = true;
        newNodeProps.isWall = false;
        break;
      case 'wall':
        newNodeProps.isStart = false;
        newNodeProps.isEnd = false;
        newNodeProps.isWall = true;
        break;
      default:
        console.log('Trying to change node to invalid node type!')
        return
    }
    let nodes = this.state.nodes;
    let node = nodes[position.x][position.y];
    node = {
      ...node,
      ...newNodeProps,
    }
    nodes[position.x][position.y] = node;
    this.setState({nodes})
  }

  componentDidMount() {
    const nodes = [];
    for(let rowCount=0; rowCount < rows; rowCount++) {
      let currentRow = [];
      for (let colCount=0; colCount < col; colCount++) {
        currentRow.push({
          //this will the the nodes properties
          row:rowCount,
          col:colCount,
          isStart:false,
          isEnd:false,
          isWall:false,
          key:`${rowCount}_${colCount}`
        });
      }
      nodes.push(currentRow);
    }
    this.setState({nodes});
  }

  render() {
    const {nodes} = this.state;
    return (
      <div className="grid">
        {nodes.map((row, rowIndex) => {
          return (
            <div>
              {row.map((node, nodeIndex) => 
              <Node
                nodeTypeHandler={this.nodeTypeHandler}  

                row={node.row}
                col={node.col}
                isStart={node.isStart}
                isEnd={node.isEnd}
                isWall={node.isWall}
                key={node.key}
              />)}
            </div>
          )
        })}
      </div>
    )
  }
}