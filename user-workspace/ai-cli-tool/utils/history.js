import fs from 'fs/promises';
import path from 'path';

// Use process.cwd() instead of import.meta.url for better compatibility
const projectRoot = process.cwd();
const HISTORY_FILE = path.join(projectRoot, '.history.json');
const CACHE_FILE = path.join(projectRoot, '.cache.json');

export class HistoryManager {
  constructor() {
    this.history = [];
    this.cache = new Map();
    this.loadHistory();
    this.loadCache();
  }

  async loadHistory() {
    try {
      const data = await fs.readFile(HISTORY_FILE, 'utf8');
      this.history = JSON.parse(data);
    } catch (error) {
      this.history = [];
    }
  }

  async loadCache() {
    try {
      const data = await fs.readFile(CACHE_FILE, 'utf8');
      const cacheData = JSON.parse(data);
      this.cache = new Map(cacheData);
    } catch (error) {
      this.cache = new Map();
    }
  }

  async saveHistory() {
    try {
      await fs.writeFile(HISTORY_FILE, JSON.stringify(this.history, null, 2));
    } catch (error) {
      console.error('Error saving history:', error.message);
    }
  }

  async saveCache() {
    try {
      await fs.writeFile(CACHE_FILE, JSON.stringify([...this.cache.entries()], null, 2));
    } catch (error) {
      console.error('Error saving cache:', error.message);
    }
  }

  async addToHistory(question, answer) {
    const entry = {
      timestamp: new Date().toISOString(),
      question,
      answer
    };
    this.history.push(entry);
    await this.saveHistory();
  }

  async getCachedResponse(question) {
    return this.cache.get(question);
  }

  async cacheResponse(question, response) {
    this.cache.set(question, {
      response,
      timestamp: new Date().toISOString()
    });
    await this.saveCache();
  }

  getRecentQuestions(limit = 5) {
    return this.history
      .slice(-limit)
      .map(entry => ({
        question: entry.question,
        timestamp: new Date(entry.timestamp).toLocaleString()
      }));
  }

  searchHistory(query) {
    const lowerQuery = query.toLowerCase();
    return this.history.filter(entry =>
      entry.question.toLowerCase().includes(lowerQuery) ||
      entry.answer.toLowerCase().includes(lowerQuery)
    );
  }
}
