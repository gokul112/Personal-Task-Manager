import React from 'react';
import '../styles/App.css';
import Board from "./Board";

function App() {
  return (
    <div className="App">
      <header className="Header">
        Personal Task Manager
      </header>
      <Board/>
    </div>
  );
}

export default App;
