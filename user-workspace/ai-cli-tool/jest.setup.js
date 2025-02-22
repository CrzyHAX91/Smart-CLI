// Mock environment variables
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.LLAMA_API_KEY = 'test-llama-key';
process.env.SERPER_API_KEY = 'test-serper-key';
process.env.REPLICATE_API_TOKEN = 'test-replicate-token';

// Mock path and URL utilities
jest.mock('url', () => ({
  fileURLToPath: jest.fn(url => '/mocked/path'),
}));

jest.mock('path', () => ({
  dirname: jest.fn(path => '/mocked/directory'),
  join: jest.fn((...args) => args.join('/')),
}));

// Mock figlet for CLI banner
jest.mock('figlet', () => ({
  textSync: jest.fn().mockReturnValue('Smart AI CLI')
}));

// Mock chalk for colored output
jest.mock('chalk', () => ({
  cyan: jest.fn(text => text),
  red: jest.fn(text => text),
  yellow: jest.fn(text => text),
  green: jest.fn(text => text),
  hex: jest.fn(() => jest.fn(text => text))
}));

// Mock boxen for CLI boxes
jest.mock('boxen', () => jest.fn(text => text));

// Mock ora for spinners
jest.mock('ora', () => jest.fn(() => ({
  start: jest.fn().mockReturnThis(),
  stop: jest.fn().mockReturnThis(),
  succeed: jest.fn().mockReturnThis(),
  fail: jest.fn().mockReturnThis()
})));
