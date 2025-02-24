const { askQuestion } = require('../commands/ask.js');

// Mock processQuery function
const mockProcessQuery = jest.fn().mockResolvedValue({
  response: 'AI stands for Artificial Intelligence.',
  source: 'openai',
  searchResults: 'Search result data'
});

// Mock AIOrchestrator
jest.mock('../services/orchestrator.js', () => ({
  AIOrchestrator: jest.fn().mockImplementation(() => ({
    processQuery: mockProcessQuery
  }))
}));

// Mock SuggestionsEngine
const mockGetSmartPrompt = jest.fn().mockResolvedValue('Enhanced query');
const mockGetSuggestions = jest.fn().mockResolvedValue({
  relatedQuestions: ['Related 1', 'Related 2'],
  powerOptions: ['Option 1', 'Option 2'],
  approaches: ['Approach 1', 'Approach 2']
});
const mockDisplaySuggestions = jest.fn();

jest.mock('../services/suggestions.js', () => ({
  SuggestionsEngine: jest.fn().mockImplementation(() => ({
    getSmartPrompt: mockGetSmartPrompt,
    getSuggestions: mockGetSuggestions,
    displaySuggestions: mockDisplaySuggestions
  }))
}));

// Mock config
jest.mock('../utils/config.js', () => ({
  getConfig: jest.fn().mockReturnValue({
    openaiApiKey: 'test-key',
    llamaApiKey: 'test-key',
    serperApiKey: 'test-key'
  })
}));

// Mock chalk
jest.mock('chalk', () => ({
  default: {
    hex: () => (text) => text,
    yellow: { bold: (text) => text },
    blue: { bold: (text) => text },
    magenta: { bold: (text) => text },
    red: { bold: (text) => text },
    green: { bold: (text) => text },
    dim: (text) => text,
    greenBright: (text) => text,
    redBright: (text) => text,
    cyan: (text) => text,
    red: (text) => text,
    green: (text) => text,
    yellow: (text) => text,
    blue: (text) => text,
    magenta: (text) => text,
    bold: (text) => text
  }
}));

// Mock boxen
jest.mock('boxen', () => ({
  __esModule: true,
  default: jest.fn((text) => text)
}));

// Mock figlet
jest.mock('figlet', () => ({
  __esModule: true,
  default: {
    textSync: jest.fn().mockReturnValue('Smart AI CLI')
  }
}));

// Mock ora
const mockOraInstance = {
  start: jest.fn().mockReturnThis(),
  stop: jest.fn().mockReturnThis(),
  succeed: jest.fn().mockReturnThis(),
  fail: jest.fn().mockReturnThis(),
  text: '',
  color: ''
};

jest.mock('ora', () => ({
  __esModule: true,
  default: jest.fn(() => mockOraInstance)
}));

describe('askQuestion', () => {
  const mockQuestion = 'What is AI?';
  const mockResponse = 'AI stands for Artificial Intelligence.';

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  test('should call orchestrator with the correct question', async () => {
    await askQuestion(mockQuestion, {});

    expect(mockProcessQuery).toHaveBeenCalledWith(
      'Enhanced query',
      { quick: false, detailed: false }
    );
  });

  test('should use smart prompt enhancement', async () => {
    await askQuestion(mockQuestion, {});

    expect(mockGetSmartPrompt).toHaveBeenCalledWith(mockQuestion);
    expect(mockOraInstance.succeed).toHaveBeenCalled();
  });

  test('should get and display suggestions', async () => {
    await askQuestion(mockQuestion, {});

    expect(mockGetSuggestions).toHaveBeenCalled();
    expect(mockDisplaySuggestions).toHaveBeenCalled();
  });

  test('should handle quick mode option', async () => {
    await askQuestion(mockQuestion, { quick: true });

    expect(mockProcessQuery).toHaveBeenCalledWith(
      'Enhanced query',
      { quick: true, detailed: false }
    );
  });

  test('should handle detailed mode option', async () => {
    await askQuestion(mockQuestion, { detailed: true });

    expect(mockProcessQuery).toHaveBeenCalledWith(
      'Enhanced query',
      { quick: false, detailed: true }
    );
  });

  test('should log the response correctly', async () => {
    await askQuestion(mockQuestion, {});

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(mockResponse)
    );
  });

  test('should handle errors gracefully', async () => {
    mockProcessQuery.mockRejectedValueOnce(new Error('API error'));

    await askQuestion(mockQuestion, {});

    expect(mockOraInstance.fail).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.any(String)
    );
  });

  test('should handle save option', async () => {
    const fs = require('fs/promises');
    jest.spyOn(fs, 'writeFile').mockResolvedValue();

    await askQuestion(mockQuestion, { save: 'output.txt' });

    expect(fs.writeFile).toHaveBeenCalledWith(
      'output.txt',
      expect.stringContaining(mockResponse),
      'utf8'
    );
  });
});
