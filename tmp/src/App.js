import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Silhouette from './Silhouette';

class ItemToRemove extends React.Component {
  render() {
    return (
      <div
        style={{
          width: 10,
          height: 10,
          backgroundColor: this.props.color || 'blue',
        }}
      />
    );
  }
}

const Memory = ({ children, forget, ...extraProps }) => {
  if (typeof forget === 'function') {
    //forget();
  }
  const unmounted = typeof forget === 'function';
  const props = unmounted ? {
    height: 5,
  } : {};
  return (
    <div
      style={{
        ...props
      }}
    >
      {children}
    </div>
  );
};

function App() {
  const [ visible, setVisible ] = useState(
    true,
  );
  useEffect(
    () => {
      setTimeout(
        () => setVisible(!visible),
        1000,
      );
    },
  );
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Silhouette
        >
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: 'orange',
            }}
          />
          {(!!visible) && (
            <ItemToRemove
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
