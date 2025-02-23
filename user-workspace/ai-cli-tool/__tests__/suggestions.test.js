const { SuggestionsEngine } = require('../services/suggestions.js');

// Mock OpenAI service
jest.mock('../services/openai.js', () => ({
  OpenAIService: jest.fn().mockImplementation(() => ({
    generateResponse: jest.fn().mockResolvedValue('Explain the fundamental concepts of Artificial Intelligence')
  }))
}));

// Mock Llama service
jest.mock('../services/llama.js', () => {
  const mockGenerateResponse = jest.fn().mockResolvedValue(JSON.stringify({
    relatedQuestions: [
      'Tell me more about What is quantum computing?',
      'What are the latest developments in What is quantum computing??',
      'What are the historical aspects of What is quantum computing??'
    ],
    powerOptions: [
      'Use --detailed for comprehensive analysis',
      'Try --quick for faster responses'
    ],
    approaches: [
      'Break down the question into smaller parts',
      'Specify a particular aspect to focus on'
    ]
  }));

  return {
    LlamaService: jest.fn().mockImplementation(() => ({
      generateResponse: mockGenerateResponse
    }))
  };
});

// Mock History Manager
jest.mock('../utils/history.js', () => ({
  HistoryManager: jest.fn().mockImplementation(() => ({
    getRecentQuestions: jest.fn().mockResolvedValue(['previous question']),
    getCachedResponse: jest.fn().mockResolvedValue(null),
    cacheResponse: jest.fn().mockResolvedValue(undefined)
  }))
}));

describe('SuggestionsEngine', () => {
  let suggestionsEngine;
  const mockConfig = {
    openaiApiKey: 'test-key',
    llamaApiKey: 'test-key'
  };

  beforeEach(() => {
    suggestionsEngine = new SuggestionsEngine(mockConfig);
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error
  });

  describe('getSuggestions', () => {
    const mockQuery = 'What is quantum computing?';
    const mockSuggestions = {
      relatedQuestions: [
        'Tell me more about What is quantum computing?',
        'What are the latest developments in What is quantum computing??',
        'What are the historical aspects of What is quantum computing??'
      ],
      powerOptions: [
        'Use --detailed for comprehensive analysis',
        'Try --quick for faster responses'
      ],
      approaches: [
        'Break down the question into smaller parts',
        'Specify a particular aspect to focus on'
      ]
    };

    test('should return suggestions for a query', async () => {
      const result = await suggestionsEngine.getSuggestions(mockQuery);
      expect(result).toEqual(mockSuggestions);
    });

    test('should use cache for repeated queries', async () => {
      // First call
      await suggestionsEngine.getSuggestions(mockQuery);
      
      // Reset mock to verify second call
      const llamaService = suggestionsEngine.llama;
      llamaService.generateResponse.mockClear();
      
      // Second call
      await suggestionsEngine.getSuggestions(mockQuery);

      // Should only call generateResponse once
      expect(llamaService.generateResponse).not.toHaveBeenCalled();
    });

    test('should handle API errors gracefully', async () => {
      const llamaService = suggestionsEngine.llama;
      llamaService.generateResponse.mockRejectedValue(new Error('API Error'));

      const result = await suggestionsEngine.getSuggestions(mockQuery);
      
      expect(result).toEqual(expect.objectContaining({
        relatedQuestions: expect.any(Array),
        powerOptions: expect.any(Array),
        approaches: expect.any(Array)
      }));
      expect(console.error).toHaveBeenCalledWith('Error getting suggestions:', expect.any(Error));
    });
  });

  describe('getSmartPrompt', () => {
    const mockQuery = 'what is ai';
    const mockImprovedQuery = 'Explain the fundamental concepts of Artificial Intelligence';

    test('should improve the query', async () => {
      const result = await suggestionsEngine.getSmartPrompt(mockQuery);
      expect(result).toBe(mockImprovedQuery);
    });

    test('should return original query on error', async () => {
      const openaiService = suggestionsEngine.openai;
      openaiService.generateResponse.mockRejectedValue(new Error('API Error'));

      const result = await suggestionsEngine.getSmartPrompt(mockQuery);
      expect(result).toBe(mockQuery);
      expect(console.error).toHaveBeenCalledWith('Error enhancing query:', expect.any(Error));
    });
  });

  describe('displaySuggestions', () => {
    const mockSuggestions = {
      relatedQuestions: ['Related question 1', 'Related question 2'],
      powerOptions: ['Option 1', 'Option 2'],
      approaches: ['Alternative 1', 'Alternative 2']
    };

    test('should display suggestions in formatted boxes', () => {
      // Mock console.log to avoid actual output during tests
      console.log = jest.fn();
      
      suggestionsEngine.displaySuggestions(mockSuggestions);

      expect(console.log).toHaveBeenCalledTimes(3); // One for each category
      mockSuggestions.relatedQuestions.forEach(question => {
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining(question));
      });
    });
  });
});
