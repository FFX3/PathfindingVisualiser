import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css'

//algorithms
import findPath from './algorithms/a*';

//variables
let rows = 15;
let col = 25;


export default class PathfindingVisualizer extends Component {
  
  //below this is all the stuff that creates the grid
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      startPosition: {},
      endPosition: {},
    };
    this.nodeTypeHandler = this.nodeTypeHandler.bind(this)
  }

  //path finding implementation
  startPathFinding(){
    const start = this.state.startPosition;
    const end = this.state.endPosition;
    //creates a grid of bools true for walkable terrain and false for the walls
    const grid = this.state.nodes.map((arr)=>{
      return  arr.map((node)=> {
        if(!node.type.includes('wall')){
          return true;
        }else{
          return false;
        }
      })
    })
    console.log(grid);
    findPath(start, end, grid);
  }

  nodeTypeHandler(type, position){
    let newNodeProps = {}
    let nodes = this.state.nodes;
    switch(type){
      case 'start':
      case 'end':

        if(type === 'start'){
          this.setState({
            startPosition: {
              x: position.x,
              y: position.y,
            }
          });
        }else{
          this.setState({
            endPosition: {
              x: position.x,
              y: position.y,
            }
          });
        }
        newNodeProps.type = [];

        break;
      case 'wall':
        newNodeProps.type = [type];
        break;
      case 'erase':
        newNodeProps.type = [];
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
          //this will be the nodes properties
          row:rowCount,
          col:colCount,
          type:[],
          explored:false,
          key:`${rowCount}_${colCount}`
        });
      }
      nodes.push(currentRow);
    }
    this.setState({nodes});
  }

  //this logic should probably be in the Node components
  styleNode(x, y){
    let style;

    if(x === this.state.startPosition.x && y === this.state.startPosition.y) {
      style = {
        ...style,
        backgroundColor: 'red',
      }
    }else if(x === this.state.endPosition.x && y === this.state.endPosition.y){
      style = {
        ...style,
        backgroundColor: 'blue',
      }
    }else{
      const type = this.state.nodes[x][y].type;
      if(type.includes('wall')){
        style = {
          ...style,
          backgroundColor: 'grey',
        }
      }
    }
    return style
  }

  //this function referers to this object's state to determine which type each node should have
  setUniqueNodeType(x, y){
    if(x === this.state.startPosition.x && y === this.state.startPosition.y) {
      return 'start';
    }else if(x === this.state.endPosition.x && y === this.state.endPosition.y){
      return 'end';
    }
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
                  explored={node.explored}
                  key={node.key}
                  type={this.setUniqueNodeType(node.row, node.col)}
                />)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}