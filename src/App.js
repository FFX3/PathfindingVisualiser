import './App.css';
import React, {useState} from 'react';

import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer';
import Form from './Form/Form';

function App() {

  //this control which type a node is toggled to on click
  const [wandType, wandManager] = useState('start')

  return (
    <div className="App">
      <Form 
        wandManager={wandManager}
      />
      <PathfindingVisualizer 
        wandType={wandType}
        key={0}
      />
    </div>
  );
}

export default App;
