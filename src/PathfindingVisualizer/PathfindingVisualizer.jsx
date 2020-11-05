import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css'

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


  //this system should be replaced with something more efficient
  //I could simply decide the styling from here based on the node position on the grid instead of iterating throught all the nodes
  //I'll come back to this once I got everything else working.
  nodeTypeHandler(type, position){
    let newNodeProps = {}
    let nodes = this.state.nodes;
    switch(type){
      case 'start':
      case 'end':
        nodes.forEach(arr=>arr.forEach(node=>console.log(node.type[0])))

        let x; let y;
        for(x=0; x<nodes.length; x++){
          for(y=0; y<nodes[x].length; y++){
            const index = nodes[x][y].type.indexOf(type);
            if(index !== -1){
              nodes[x][y].type.splice(index, 1);
            }
          }
        }

        newNodeProps.type = [type]
        break;
      case 'wall':
        newNodeProps.type = ['wall']
        break;
      default:
        console.log('Trying to change node to invalid node type!')
        return
    }
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
          type:[],
          key:`${rowCount}_${colCount}`
        });
      }
      nodes.push(currentRow);
    }
    this.setState({nodes});
  }

  styleNode(x, y){
    const type = this.state.nodes[x][y].type;
    let style;
      if(type.includes('start')) { 
        style = {
          ...style,
          backgroundColor: 'red', 
        }
      };
      if(type.includes('end')) {
        style = {
          ...style,
          backgroundColor: 'blue',
        }
      }
      
    return style
  }

  render() {
    const {nodes} = this.state;
    return (
      <div>
        <div className="grid">
          {nodes.map((row, rowIndex) => {
            return (
              <div>
                {row.map((node, nodeIndex) => 
                <Node
                  nodeTypeHandler={this.nodeTypeHandler}
                  wandType={this.props.wandType}
  
                  row={node.row}
                  col={node.col}
                  style={this.styleNode(node.row, node.col)}
                  key={node.key}
                />)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}