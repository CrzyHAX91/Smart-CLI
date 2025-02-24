import React, { useState, useEffect } from 'react';
import { SerperService } from './services/serper';
import { LlamaService } from './services/llama';
import { OpenAIService } from './services/openai';

const serperService = new SerperService();
const llamaService = new LlamaService(process.env.LLAMA_API_KEY);
const openaiService = new OpenAIService();

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [llamaResponse, setLlamaResponse] = useState('');
  const [openaiResponse, setOpenaiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeModel, setActiveModel] = useState('all');
  const [searchHistory, setSearchHistory] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    search: false,
    llama: false,
    openai: false
  });

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (query, results) => {
    const newHistory = [{ query, timestamp: new Date().toISOString() }, ...searchHistory].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setLoadingStates({ search: true, llama: true, openai: true });

    try {
      const promises = [];
      
      // Always perform search
      promises.push(serperService.search(query));

      // Add AI model promises based on selection
      if (activeModel === 'all' || activeModel === 'llama') {
        promises.push(llamaService.generateResponse(query));
      } else {
        promises.push(Promise.resolve(''));
      }

      if (activeModel === 'all' || activeModel === 'openai') {
        promises.push(openaiService.generateResponse(query));
      } else {
        promises.push(Promise.resolve(''));
      }

      const [searchData, llamaData, openaiData] = await Promise.all(promises);

      setSearchResults(searchData);
      setLlamaResponse(llamaData);
      setOpenaiResponse(openaiData);
      saveToHistory(query, { search: searchData, llama: llamaData, openai: openaiData });
    } catch (err) {
      setError(`🚨 Error: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
      setLoadingStates({ search: false, llama: false, openai: false });
    }
  };

  return (
    <div className="search-container">
      <div className="model-selector">
        <button 
          className={`model-button ${activeModel === 'all' ? 'active' : ''}`}
          onClick={() => setActiveModel('all')}
        >
          All Models
        </button>
        <button 
          className={`model-button ${activeModel === 'llama' ? 'active' : ''}`}
          onClick={() => setActiveModel('llama')}
        >
          Llama
        </button>
        <button 
          className={`model-button ${activeModel === 'openai' ? 'active' : ''}`}
          onClick={() => setActiveModel('openai')}
        >
          OpenAI
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query..."
          className="search-input"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="search-button"
        >
          {isLoading ? '🔄 Processing...' : '🔍 Search'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="results-container">
        <div className={`search-results ${loadingStates.search ? 'loading' : ''}`}>
          <h2>🌐 Web Results</h2>
          {Array.isArray(searchResults) ? (
            searchResults.map((result, index) => (
              <div key={index} className="result-item">
                {result}
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>

        <div className={`ai-response ${loadingStates.llama ? 'loading' : ''}`}>
          <h2>🦙 Llama AI Response</h2>
          {llamaResponse ? (
            <div className="response-content">
              {llamaResponse}
            </div>
          ) : (
            <p>No Llama AI response yet</p>
          )}
        </div>

        <div className={`ai-response ${loadingStates.openai ? 'loading' : ''}`}>
          <h2>🤖 OpenAI Response</h2>
          {openaiResponse ? (
            <div className="response-content">
              {openaiResponse}
            </div>
          ) : (
            <p>No OpenAI response yet</p>
          )}
        </div>
      </div>

      {searchHistory.length > 0 && (
        <div className="search-history">
          <h3>Recent Searches</h3>
          <div className="history-list">
            {searchHistory.map((item, index) => (
              <div 
                key={index} 
                className="history-item"
                onClick={() => {
                  setQuery(item.query);
                  handleSearch();
                }}
              >
                <span>{item.query}</span>
                <small>{new Date(item.timestamp).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
