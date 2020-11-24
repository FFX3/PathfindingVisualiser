//I'm using linked list to keep track of which nodes were used to get to the current node to calculate the G-cost
class PathNode {
  constructor(x, y, prev, gCost) {
    this.data = {
      position: {
        x:x,
        y:y,
      },
      neighbours: [],
      gCost: gCost
    };
    this.prev = prev;           
  }
}

const dijkstra = (start, end, grid, nodesList, init) => {
  let nodes = nodesList

  //if first iteration
  if(init){
    nodes.start = start;
    nodes.end = end;
    nodes.nodeListGCost = grid; // this creates a new set of nested arrays with the proper dimensions, I'll use this to keep track of gCost
    nodes.nodeListGCost[start.y][start.x] = 0;
    nodes.explored = []
    nodes.queue = []
    nodes.queue.push(new PathNode(start.x, start.y, null, 0));
  }

  nodes.currentNode = nodes.queue.pop();

  nodes.explored.push(nodes.currentNode.data.position);
  //step 1 assign neighbours new GCost
  nodes.currentNode.data.neighbours = findNeighbours(nodes.currentNode.data.position, grid);
  nodes.currentNode.data.neighbours.forEach(position=>{
    let distanceFromThisNode;
    if(nodes.currentNode.data.position.x !== position.x && nodes.currentNode.data.position.y !== position.y){//then this is a diagonal
      distanceFromThisNode = Math.sqrt(2);
    }else{
      distanceFromThisNode = 1;
    }
    if(nodes.nodeListGCost[position.y][position.x] === true || nodes.nodeListGCost[position.y][position.x] === false){
      nodes.nodeListGCost[position.y][position.x] = nodes.currentNode.data.gCost + distanceFromThisNode;
    }
    else{
      if(nodes.currentNode.data.gCost + distanceFromThisNode < nodes.nodeListGCost[position.y][position.x]){
        nodes.nodeListGCost[position.y][position.x] = nodes.currentNode.data.gCost + distanceFromThisNode;
      }
    }
  });
  //step 2 initiate the new nodes and order them based on gCost in the queue
  nodes.currentNode.data.neighbours.forEach(position=>{
    let newNode = new PathNode(position.x, position.y, nodes.currentNode, nodes.nodeListGCost[position.y][position.x]);
    if(nodes.queue.length === 0){
      nodes.queue.push(newNode);
    }else{

      for(let index = nodes.queue.length-1; index>=0; index--){
        if(newNode.data.gCost < nodes.queue[index].gCost){
          //add this node right after it
          nodes.queue.splice(index+1, 0, newNode);
          console.log('node added')
        }else if(index === 0){
          //this is this node is has the highest gCost and should be the first in the array
          nodes.queue.unshift(newNode);
          console.log('node added')
        }
      }
    }
  })

  console.log(nodes);

  return nodes;
}

//utilites
const findNeighbours = (position, grid) => {
  let neighbours = [];

  //bools to save from checking again when we start looking for diagonal neighbours
  let right = false;
  let left = false;
  let down = false;
  let up = false;

  //right
  if(!(position.x + 1 >= grid[position.y].length)){ //check if this position is on the grid
    if(grid[position.y][position.x+1]){neighbours.push({
      x: position.x+1,
      y: position.y,
    });}
    right = true;
  }
  //left
  if(!(position.x - 1 < 0)){
    if(grid[position.y][position.x-1]){neighbours.push({
      x: position.x-1,
      y: position.y,
    });}
    left = true;
  }
  //down
  if(!(position.y + 1 >= grid.length)){
    if(grid[position.y+1][position.x]){neighbours.push({
      x: position.x,
      y: position.y+1,
    });}
    down = true;
  }//up
  if(!(position.y - 1 < 0)){
    if(grid[position.y-1][position.x]){neighbours.push({
      x: position.x,
      y: position.y-1,
    });}
    up = true;
  }

  //find diagonal neighbours
  if(left){
    if(down){
      if(grid[position.y+1][position.x-1]){neighbours.push({
        x:position.x-1,
        y:position.y+1,
      })}
    }
    if(up){
      if(grid[position.y-1][position.x-1]){neighbours.push({
        x:position.x-1,
        y:position.y-1,
      })}
    }
  }
  if(right){
    if(down){
      if(grid[position.y+1][position.x+1]){neighbours.push({
        x:position.x+1,
        y:position.y+1,
      })}
    }
    if(up){
      if(grid[position.y-1][position.x+1]){neighbours.push({
        x:position.x+1,
        y:position.y-1,
      })}
    }
  }


  //remove walls from neighbours
   
  return neighbours;
}

export default dijkstra;