import { SuggestionsEngine } from '../services/suggestions.js';
import { OpenAIService } from '../services/openai.js';
import { HistoryManager } from '../utils/history.js';

jest.mock('../services/openai.js');
jest.mock('../utils/history.js');

describe('SuggestionsEngine', () => {
  let suggestionsEngine;
  const mockConfig = {
    openaiApiKey: 'test-key'
  };

  beforeEach(() => {
    suggestionsEngine = new SuggestionsEngine(mockConfig);
    jest.clearAllMocks();
  });

  describe('getSuggestions', () => {
    const mockQuery = 'What is quantum computing?';
    const mockSuggestions = {
      related: ['How does quantum entanglement work?', 'What are qubits?'],
      options: ['Use --detailed for in-depth analysis', 'Try --quick for basic overview'],
      alternatives: ['Break down the question', 'Focus on specific aspects']
    };

    beforeEach(() => {
      OpenAIService.prototype.generateResponse.mockResolvedValue(JSON.stringify(mockSuggestions));
      HistoryManager.prototype.getRecentQuestions.mockResolvedValue(['previous question']);
    });

    it('should return suggestions for a query', async () => {
      const result = await suggestionsEngine.getSuggestions(mockQuery);
      
      expect(result).toEqual(mockSuggestions);
      expect(OpenAIService.prototype.generateResponse).toHaveBeenCalled();
    });

    it('should use cache for repeated queries', async () => {
      await suggestionsEngine.getSuggestions(mockQuery);
      await suggestionsEngine.getSuggestions(mockQuery);

      expect(OpenAIService.prototype.generateResponse).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors gracefully', async () => {
      OpenAIService.prototype.generateResponse.mockRejectedValue(new Error('API Error'));

      const result = await suggestionsEngine.getSuggestions(mockQuery);
      
      expect(result).toEqual(expect.objectContaining({
        related: expect.any(Array),
        options: expect.any(Array),
        alternatives: expect.any(Array)
      }));
    });
  });

  describe('getSmartPrompt', () => {
    const mockQuery = 'what is ai';
    const mockImprovedQuery = 'Explain the fundamental concepts of Artificial Intelligence';

    beforeEach(() => {
      OpenAIService.prototype.generateResponse.mockResolvedValue(mockImprovedQuery);
    });

    it('should improve the query', async () => {
      const result = await suggestionsEngine.getSmartPrompt(mockQuery);
      
      expect(result).toBe(mockImprovedQuery);
      expect(OpenAIService.prototype.generateResponse).toHaveBeenCalled();
    });

    it('should return original query on error', async () => {
      OpenAIService.prototype.generateResponse.mockRejectedValue(new Error('API Error'));

      const result = await suggestionsEngine.getSmartPrompt(mockQuery);
      
      expect(result).toBe(mockQuery);
    });
  });

  describe('displaySuggestions', () => {
    const mockSuggestions = {
      related: ['Related question 1', 'Related question 2'],
      options: ['Option 1', 'Option 2'],
      alternatives: ['Alternative 1', 'Alternative 2']
    };

    it('should display suggestions in formatted boxes', () => {
      suggestionsEngine.displaySuggestions(mockSuggestions);

      expect(console.log).toHaveBeenCalledTimes(3); // One for each category
      mockSuggestions.related.forEach(question => {
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining(question));
      });
    });
  });
});
