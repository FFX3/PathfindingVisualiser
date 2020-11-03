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
    console.log('hello')
  }

  componentDidMount() {
    const nodes = [];
    for(let rowCount=0; rowCount < rows; rowCount++) {
      let currentRow = [];
      for (let colCount=0; colCount < col; colCount++) {
        currentRow.push([]);
      }
      nodes.push(currentRow);
    }
    this.setState({nodes});
  }

  render() {
    const {nodes} = this.state;
    console.log(nodes);
    return (
      <div className="grid">
        {nodes.map((row, rowIndex) => {
          return (
            <div>
              {row.map((node, nodeIndex) => <Node></Node>)}
            </div>
          )
        })}
      </div>
    )
  }
}