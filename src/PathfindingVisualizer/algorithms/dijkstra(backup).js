//I'm using linked list to keep track of which nodes were used to get to the current node to calculate the G-cost
class PathNode {
  constructor(x, y, prev) {
    this.data = {
      position: {
        x:x,
        y:y,
      },
      neighbours: [],
    };
    this.prev = prev;           
  }
  //calculates gCost - returns gCost and fixes path if earlier neighbour is found
  gCost(){
    //debug
    // console.log(`function called ${this.data.position.x}, ${this.data.position.y}`)
    let gCost = 0;

    if(this.prev === null){
      //debug
      // console.log('function returns 0 this is the first Node')
      return 0;
    }else{
      let earliestNeighbour = this.prev;
      let currentNode = earliestNeighbour;
      let thisPosition = this.data.position;

      //debug
      // if(currentNode.prev !== null){
      //   console.log('entered the loop')
      // }else{
      //   console.log('skipped the loop')
      // }

      while(currentNode.prev !== null){
        if(currentNode.prev.data.neighbours.includes(thisPosition)){
          //found an earlier neighbour, now lets check if 
          earliestNeighbour = currentNode.prev;
        }

        currentNode = currentNode.prev;
        //debug
        // if(currentNode.prev !== null){
        //   console.log('continued the loop')
        // }else{
        //   console.log('exited the loop')
        // }
      }
      currentNode = currentNode.prev;
      gCost = earliestNeighbour.gCost() + 1;
      this.prev = earliestNeighbour;

      //debug
      // console.log(`function returns ${gCost}`)
      return gCost;
    }
  }
}
const findNeighbours = (position, grid) => {
  let neighbours = [];

  //bools to save from checking again when we start looking for diagonal neighbours
  let right = false;
  let left = false;
  let down = false;
  let up = false;

  //right
  if(!(position.x + 1 >= grid[position.y].length)){ //check if this position is on the grid
    neighbours.push({
      x: position.x+1,
      y: position.y,
    });
    right = true;
  }
  //left
  if(!(position.x - 1 < 0)){
    neighbours.push({
      x: position.x-1,
      y: position.y,
    });
    left = true;
  }
  //down
  if(!(position.y + 1 >= grid.length)){
    neighbours.push({
      x: position.x,
      y: position.y+1,
    });
    down = true;
  }//up
  if(!(position.y - 1 < 0)){
    neighbours.push({
      x: position.x,
      y: position.y-1,
    });
    up = true;
  }

  //find diagonal neighbours
  if(left){
    if(down){
      neighbours.push({
        x:position.x-1,
        y:position.y+1,
      })
    }
    if(up){
      neighbours.push({
        x:position.x-1,
        y:position.y-1,
      })
    }
  }
  if(right){
    if(down){
      neighbours.push({
        x:position.x+1,
        y:position.y+1,
      })
    }
    if(up){
      neighbours.push({
        x:position.x-1,
        y:position.y-1,
      })
    }
  }

  return neighbours;
}


const dijkstra = (startPosition, endPosition, grid) => {
  let startNode = new PathNode(startPosition.x, startPosition.y, null);
  let nodeQueue = [];
  let exploredNodePositions = [];

  let currentNode = startNode;

  let counter = 0;
  //start the loop till we find the path or explore all the nodes
  while(currentNode.data.position !== endPosition && counter < 3){
  //console.log([`counter, curNode, curNodeGCost, Node Queue, explored Nodes`,counter,currentNode,currentNode.gCost(),nodeQueue,exploredNodePositions]);

  //find neighbours
    let curPos = currentNode.data.position;
    currentNode.data.neighbours = findNeighbours(curPos, grid);   

    if(counter === 2){
      currentNode.gCost();
    }
    counter += 1;
    

    //add new nodes into the queue
    currentNode.data.neighbours.forEach((position)=>{
      let node = new PathNode(position.x, position.y, currentNode);
      //check if node is already in the queue or has been explored - otherwise we get an infinite loop
      if(!nodeQueue.includes(node) && !exploredNodePositions.includes(position)){

        //
        //This function need to add nodes in the queue ordered by gCost
        //
        nodeQueue.push(node);
      }
    });

    exploredNodePositions.push(currentNode.data.position);
    currentNode = nodeQueue.pop();
  }
}

export default dijkstra;