import React from 'react';
import './App.css';
import SearchComponent from './SearchComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI-Powered Search</h1>
      </header>
      <main className="App-main">
        <SearchComponent />
      </main>
    </div>
  );
}

export default App;
