// Mock environment variables
process.env = {
  ...process.env,
  OPENAI_API_KEY: 'test-openai-key',
  LLAMA_API_KEY: 'test-llama-key',
  SERPER_API_KEY: 'test-serper-key',
  REPLICATE_API_TOKEN: 'test-replicate-token'
};

// Create a chainable chalk mock
const createChainableChalk = () => {
  const handler = {
    get: (target, prop) => {
      if (prop === 'hex') {
        return () => createChainableChalk();
      }
      return (...args) => args[0];
    }
  };
  return new Proxy(() => {}, handler);
};

// Mock chalk
jest.mock('chalk', () => {
  const chalkMock = createChainableChalk();
  return {
    __esModule: true,
    default: new Proxy(chalkMock, {
      get: (target, prop) => {
        if (prop === 'hex') {
          return () => createChainableChalk();
        }
        return (...args) => args[0];
      }
    })
  };
});

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
jest.mock('ora', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    start: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    text: '',
    color: ''
  }))
}));

// Mock node-fetch
jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ 
        choices: [{ message: { content: 'mocked response' } }],
        organic: [],
        relatedSearches: []
      })
    })
  )
}));
