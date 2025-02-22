import { askQuestion } from '../commands/ask.js';
import { AIOrchestrator } from '../services/orchestrator.js';
import { OpenAIService } from '../services/openai.js';
import { HistoryManager } from '../utils/history.js';

jest.mock('../services/orchestrator.js');
jest.mock('../services/openai.js');
jest.mock('../utils/history.js');

describe('askQuestion', () => {
  const mockQuestion = 'What is AI?';
  const mockResponse = 'AI stands for Artificial Intelligence.';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call orchestrator with the correct question', async () => {
    AIOrchestrator.prototype.processQuery.mockResolvedValue({ response: mockResponse });
    
    await askQuestion(mockQuestion, {});

    expect(AIOrchestrator.prototype.processQuery).toHaveBeenCalledWith(mockQuestion, { quick: false, detailed: false });
  });

  it('should log the response correctly', async () => {
    AIOrchestrator.prototype.processQuery.mockResolvedValue({ response: mockResponse });

    await askQuestion(mockQuestion, {});

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining(mockResponse));
  });

  it('should handle errors gracefully', async () => {
    AIOrchestrator.prototype.processQuery.mockRejectedValue(new Error('API error'));

    await askQuestion(mockQuestion, {});

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error: API error'));
  });
});
