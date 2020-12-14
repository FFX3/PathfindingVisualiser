
const CreateNode = (position, gCost) => {
  let node = {
    position:{x:position.x, y:position.y},
    gCost:gCost,
    prev: null,
    explored:false,
  } 
  return node
}

const CreateNodeGridFromBoolGrid = (grid, start) => {
  let nodeGrid = grid;
  for(let y = 0; y < grid.length; y++){
    for(let x = 0; x < grid[y].length; x++){
      if(nodeGrid[y][x]){ // this is not a wall
        if(x === start.x && y === start.y){
          //this is the starting node and therefore has a gCost of 0
          nodeGrid[y][x] = CreateNode({x:x, y:y}, 0);
        }else{
          //this is not the starting node and therefor has an infinite gCost
          nodeGrid[y][x] = CreateNode({x:x, y:y}, Infinity);
        }
      }else{//this position is supposed to be a wall
        nodeGrid[y][x] = 'wall';
      }
    }
  }
  return nodeGrid;
}

const CreatExplorationQueue = (nodeGrid, start) => { //the exploration queue is an array of positions ordered by the gCost of the node they each respectivly point to. if the last index points a node with the gCost of infinity then this means no path can be found
  let queue = [start]
  
  for(let y = 0; y < nodeGrid.length; y++){
    for(let x = 0; x < nodeGrid[y].length; x++){
      if(!(x === start.x && y === start.y) && !(nodeGrid[y][x] === 'wall')){//skip this position if it's the start (we already added it) or if it's a wall
        queue.push({x:x, y:y});
      }
    }
  }
  return queue.reverse();
}

const GCost = (nodeGrid, position) => {
  if(nodeGrid[position.y][position.x] !== 'wall' && nodeGrid[position.y][position.x] !== undefined){
    return nodeGrid[position.y][position.x].gCost;
  }else{
    return undefined;
  }
}

const ChangeGCost = (nodeGrid, position, gCost) => {
  if(nodeGrid[position.y][position.x] !== 'wall' && nodeGrid[position.y][position.x] !== undefined){
    nodeGrid[position.y][position.x].gCost = gCost;
  }
  return nodeGrid
}

const UpdateExplorationQueue = (nodeGrid, position, queue) => {
  queue = queue.reverse()
  if(nodeGrid[position.y][position.x] === 'wall'){
    return undefined
  }

  let gCost = GCost(nodeGrid, position)

  queue = queue.filter((pos)=>{
    if(pos.x === position.x && pos.y === position.y){
      return false
    }else{
      return true
    }
  })

  for(let i=0; i<queue.length; i++){
    if(gCost <= GCost(nodeGrid, queue[i])){
      queue.splice(i, 0, position)
      return queue.reverse();
    }
  }
  queue.push(position)
  return queue.reverse()
}

const Prev = (nodeGrid, position) => {
  if(nodeGrid[position.y][position.x] !== 'wall' && nodeGrid[position.y][position.x] !== undefined){
    return nodeGrid[position.y][position.x].prev;
  }else{
    return undefined;
  }
}

const ChangePrev = (nodeGrid, position, prev) => {
  if(nodeGrid[position.y][position.x] !== 'wall' && nodeGrid[position.y][position.x] !== undefined){
    nodeGrid[position.y][position.x].prev = prev;
  }
  return nodeGrid
}

const FindNeighbours = (nodeGrid, position) => {
  let neighbours = []
  let left = false
  let right = false
  let up = false
  let down = false

  if(!(position.y -1 < 0)){
    up = true
    neighbours.push({x:position.x, y:position.y-1})
  }
  if(position.y + 1 < nodeGrid.length){
    down = true
    neighbours.push({x:position.x, y:position.y+1})
  }
  if(!(position.x - 1 < 0)){
    left = true
    neighbours.push({x:position.x-1, y:position.y})
  }
  if(position.x + 1 < nodeGrid[position.y].length){
    right = true
    neighbours.push({x:position.x+1, y:position.y})
  }

  //diagonals
  if(up){
    if(left){
      neighbours.push({x:position.x-1, y:position.y-1})
    }
    if(right){
      neighbours.push({x:position.x+1, y:position.y-1})
    }
  }
  if(down){
    if(left){
      neighbours.push({x:position.x-1, y:position.y+1})
    }
    if(right){
      neighbours.push({x:position.x+1, y:position.y+1})
    }
  }

  //clean walls from neighbor list
  neighbours = neighbours.filter((position) =>{
    if(nodeGrid[position.y][position.x] === 'wall'){
      return false
    }else{
      return true
    }
  })
  return neighbours
}

const isNextToEnd = (position, end) => {
  let distanceFromEnd = CalculateDistance(position, end)
  if(distanceFromEnd <= Math.SQRT2){
    return true
  }else{
    return false
  }
}

const CalculateDistance = (position1, position2) => {
  return Math.sqrt((position1.x-position2.x)**2 + (position1.y-position2.y)**2)
}

const CrawlPath = (nodeGrid, head) => {//returns an array of nodes in the path ordered from last to first
  let curPos = head
  let path = []

  while(curPos !== null){
    path.push(curPos)
    curPos = nodeGrid[curPos.y][curPos.x].prev
  }
  return path
}

export {CreateNodeGridFromBoolGrid, CreatExplorationQueue, GCost, ChangeGCost, Prev, ChangePrev, FindNeighbours, isNextToEnd, UpdateExplorationQueue, CalculateDistance, CrawlPath};