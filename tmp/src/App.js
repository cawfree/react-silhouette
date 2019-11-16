import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Silhouette from './Silhouette';

function App() {
  const [ visible, setVisible ] = useState(
    true,
  );
  useEffect(
    () => {
      setTimeout(
        () => setVisible(false),
        1000,
      );
    },
    [],
  );
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Silhouette>
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: 'orange',
            }}
          />
          {(!!visible) && (
            <div
              key="sheepdog"
              style={{
                width: 10,
                height: 10,
                backgroundColor: 'green',
              }}
            />
          )} 
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: 'orange',
            }}
          />
        </Silhouette>
      </header> 
    </div>
  );
}

export default App;
