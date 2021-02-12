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
      startPosition: {x:4,y:7},
      endPosition: {x:20,y:7},
      timeOutIDs: [],
      isMouseDown: false,
      isPathDrawn: false,
    };
    this.nodeTypeHandler = this.nodeTypeHandler.bind(this);
    this.startPathFinding = this.startPathFinding.bind(this);
    this.drawPath = this.drawPath.bind(this);
    this.resetGrid = this.resetGrid.bind(this);
    this.toggleMouseState = this.toggleMouseState.bind(this);
  }

  //path finding implementation
  startPathFinding(delay){
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
      if(delay>0){
        let timeoutID = setTimeout((curPos)=>{
          this.nodeTypeHandler('explored', curPos)
        },delay*loopCount, currentNodePos)
        this.setState(prevState => ({
          timeOutIDs:[...prevState.timeOutIDs, timeoutID]
        }))
      }else{
        this.nodeTypeHandler('explored', currentNodePos)
      }

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

        if(delay > 0){
          let timeoutID = setTimeout((path)=>{
            this.drawPath(path)
          },delay*loopCount, path)
          this.setState(prevState => ({
            timeOutIDs:[...prevState.timeOutIDs, timeoutID]
          }))
        }else{
          this.drawPath(path)
        }


        return path
      }
      if(dijkstra.GCost(nodeGrid, queue[queue.length-1]) === Infinity){
        break;
      }
    }
    alert('No path found')
    return null
  }

  drawPath(pathArr){
    this.setState({isPathDrawn:true})
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
    let mazeChanged = false;
    switch(type){
      case 'start':
      case 'end':
        mazeChanged = true
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
        //check if this node is the start or end, in that case don't add wall to it's type
        if((position.x !== this.state.startPosition.x || position.y !== this.state.startPosition.y) && (position.x !== this.state.endPosition.x || position.y !== this.state.endPosition.y)){
          newNodeProps.type = [type]
        }
        break;
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
    if(mazeChanged){
      this.setState({nodes}, this.updatePathfinding)
    }else{
      this.setState({nodes})
    }
  }
  updatePathfinding(){
    if(this.state.isPathDrawn === true){
      this.resetGrid(false) 
      this.startPathFinding(0)
    }
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

  resetGrid(bClearWall){ //clean grid types while preserving the 'walls' this will be called right before a solve starts to make sure the solve is not affected by previous solves
    this.state.timeOutIDs.forEach((ID)=>{
      clearTimeout(ID)
    })

    if(bClearWall){
      this.state.nodes.forEach((row)=>{
        row.forEach((node)=>{
          if(!(node.type.includes('start') || node.type.includes('end'))){
            this.nodeTypeHandler('erase', {x:node.col, y:node.row})
          }
        })
      })
    }else{
      this.state.nodes.forEach((row)=>{
        row.forEach((node)=>{
          if(!(node.type.includes('start') || node.type.includes('end') || node.type.includes('wall'))){
            this.nodeTypeHandler('erase', {x:node.col, y:node.row})
          }
        })
      })
    }
  }

  //this logic should probably be in the Node components
  styleNode(x, y){
    let style;

    if(x === this.state.startPosition.x && y === this.state.startPosition.y) {
      style = {
        ...style,
        backgroundColor: '#FF8B00',
      }
    }else if(x === this.state.endPosition.x && y === this.state.endPosition.y){
      style = {
        ...style,
        backgroundColor: '#C4FD00',
      }
    }else{
      const type = this.state.nodes[y][x].type;
      if(type.includes('wall')){
        style = {
          ...style,
          backgroundColor: 'Black',
        }
      }
      if(type.includes('explored')){
        style = {
          ...style,
          backgroundColor: '#99D5F5'
        }
      }
      if(type.includes('path')){
        style = {
          ...style,
          backgroundColor: '#F300C5',
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

  //toggle mouse state takes true or false as an argument
  toggleMouseState(b){
    this.setState({isMouseDown: b})
  }

  render() {
    const {nodes} = this.state;
    return (
      <div>
        <div className="inputs">
          <button onClick={()=>{
              this.resetGrid(false) 
              this.startPathFinding(150)
              }}>Solve</button>
          <button onClick={()=>{
              this.resetGrid(false) 
              this.startPathFinding(0)
            }}>Instant Solve</button>
          <button onClick={()=>{
              this.resetGrid(true)
              this.setState({isPathDrawn:false})
            }}>Clear Grid</button>
          
        </div>
        <div className="grid">
          {nodes.map((row, rowIndex) => {
            return (
              <div>
                {row.map((node, nodeIndex) => 
                <Node
                  nodeTypeHandler={this.nodeTypeHandler}
                  wandType={this.props.wandType}
                  toggleMouseState={this.toggleMouseState}
                  isMouseDown={this.state.isMouseDown}
  
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