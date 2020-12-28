import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css'

//algorithms
import * as dijkstra from './algorithms/dijkstra';

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
    this.nodeTypeHandler = this.nodeTypeHandler.bind(this);
    this.startPathFinding = this.startPathFinding.bind(this);
    this.drawPath = this.drawPath.bind(this);
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
    let nodeGrid = dijkstra.CreateNodeGridFromBoolGrid(grid, start);
    let queue = dijkstra.CreatExplorationQueue(nodeGrid, start);
    let currentNodePos = start
    let loopCount = 0

    //loop starts here
    while(queue.length>0){
      currentNodePos = queue.pop()

      //tracking the loop count to add the proper delay to rendering
      loopCount += 1

      // this changes the color of the nodes
      setTimeout((curPos)=>{
        this.nodeTypeHandler('explored', curPos)
      },1000*loopCount, currentNodePos)

      let neighbours = dijkstra.FindNeighbours(nodeGrid, currentNodePos);
      neighbours.forEach((neighbour) => {
        if(dijkstra.GCost(nodeGrid, currentNodePos) + dijkstra.CalculateDistance(currentNodePos, neighbour) < dijkstra.GCost(nodeGrid, neighbour)){
          nodeGrid = dijkstra.ChangeGCost(nodeGrid, neighbour, dijkstra.GCost(nodeGrid, currentNodePos) + dijkstra.CalculateDistance(currentNodePos, neighbour))
          nodeGrid = dijkstra.ChangePrev(nodeGrid, neighbour, currentNodePos)

          queue = dijkstra.UpdateExplorationQueue(nodeGrid, neighbour, queue)
        }
      })
      if(dijkstra.isNextToEnd(currentNodePos, end)){
        console.log(`path found! path G-Cost is ${dijkstra.GCost(nodeGrid, end)}`)
        console.log(nodeGrid)
        //end function return path
        let path = dijkstra.CrawlPath(nodeGrid, end);
        console.log(path)
        setTimeout((path)=>{
          this.drawPath(path)
        },1000*loopCount, path)
        return path
      }
      if(dijkstra.GCost(nodeGrid, queue[queue.length-1]) === Infinity){
        break;
      }
    }
    console.log('No path found')
    return null
  }

  drawPath(pathArr){
    console.log(pathArr)
    if(pathArr !== null){
      Array.prototype.forEach.call(pathArr, (position) => {
        this.nodeTypeHandler('path', position)
      })
    }
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
      case 'path':
      case 'explored':
        newNodeProps.type = [type];
        break;
      case 'erase':
        newNodeProps.type = [];
        break;
      default:
        console.log('Trying to change node to invalid node type!')
        return
    }
    let node = nodes[position.y][position.x];
    node = {
      ...node,
      ...newNodeProps,
    }
    nodes[position.y][position.x] = node;
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
          key:`${rowCount}_${colCount}`,
          isPath: false,
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
      const type = this.state.nodes[y][x].type;
      if(type.includes('wall')){
        style = {
          ...style,
          backgroundColor: 'grey',
        }
      }
      if(type.includes('explored')){
        style = {
          ...style,
          backgroundColor: '#00FFFF'
        }
      }
      if(type.includes('path')){
        style = {
          ...style,
          backgroundColor: 'green',
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
        <button onClick={this.startPathFinding}>Start</button>
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
                  style={this.styleNode(node.col, node.row)}
                  explored={node.explored}
                  isPath={node.isPath}
                  key={node.key}
                  type={this.setUniqueNodeType(node.col, node.row)}
                />)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}