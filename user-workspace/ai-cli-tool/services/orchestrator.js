import { SerperService } from './serper.js';
import { OpenAIService } from './openai.js';
import { LlamaService } from './llama.js';
import { HistoryManager } from '../utils/history.js';
import dotenv from 'dotenv';

dotenv.config();

export class AIOrchestrator {
  constructor(config = {}) {
    this.serper = new SerperService(config);
    this.openai = new OpenAIService(config);
    this.llama = new LlamaService(config);
    this.history = new HistoryManager();
  }

  async processQuery(query, options = {}) {
    try {
      // Check cache first if quick mode is enabled
      if (options.quick) {
        const cached = await this.history.getCachedResponse(query);
        if (cached) {
          return {
            response: cached.response,
            source: 'cache',
            timestamp: cached.timestamp
          };
        }
      }

      // Get search results from Serper
      const searchResults = await this.serper.search(query);

      // Try to get AI-enhanced response using multiple models with fallback
      let aiResponse = null;
      let usedModel = null;

      try {
        // Try OpenAI first
        const context = this.createPrompt(query, searchResults, options);
        aiResponse = await this.openai.generateResponse(context);
        usedModel = 'openai';
      } catch (openaiError) {
        console.warn('OpenAI enhancement failed, trying Llama:', openaiError.message);
        
        try {
          // Fallback to Llama
          const llamaContext = this.createPrompt(query, searchResults, options);
          aiResponse = await this.llama.generateResponse(llamaContext);
          usedModel = 'llama';
        } catch (llamaError) {
          console.warn('Llama enhancement failed, falling back to search results:', llamaError.message);
        }
      }

      // Format the final response
      const formattedResponse = this.formatResponse(aiResponse, searchResults, query);

      // Cache the response
      await this.history.cacheResponse(query, formattedResponse);
      await this.history.addToHistory(query, formattedResponse);

      return {
        response: formattedResponse,
        source: usedModel || 'search',
        searchResults,
        usedModel
      };

    } catch (error) {
      console.error('Orchestration error:', error);
      throw error;
    }
  }

  createPrompt(query, searchResults, options) {
    return `Based on the following search results and the user's query "${query}", please provide a ${options.detailed ? 'detailed' : 'concise'} answer:

Search Results:
${searchResults}

Additional requirements:
${options.detailed ? '- Provide a detailed explanation with examples' : '- Keep it concise'}
- Include relevant facts and figures
- Cite sources when possible
- Focus on practical, actionable information`;
  }

  formatResponse(aiResponse, searchResults, query) {
    // If AI response is available, use it
    if (aiResponse) {
      return aiResponse;
    }
    
    // Otherwise, format search results
    try {
      // Parse the search results
      const results = searchResults.split('\n').filter(line => line.trim());
      
      // Extract the most relevant result
      const mainResult = results.find(line => 
        line.toLowerCase().includes(query.toLowerCase()) ||
        (line.startsWith('1.') && !line.toLowerCase().includes('url:'))
      );

      if (!mainResult) {
        return `Based on the search results, here's what I found:\n\n${results[0]}`;
      }

      // Find additional context
      const additionalInfo = results.find(line => 
        !line.includes(mainResult) &&
        !line.toLowerCase().includes('url:') &&
        line.trim().length > 0
      );

      // Format the response
      let response = mainResult.trim();
      if (additionalInfo) {
        response += '\n\n' + additionalInfo.trim();
      }

      return response;
    } catch (error) {
      console.error('Error formatting search results:', error);
      return `Based on the search results, here's what I found:\n\n${searchResults.split('\n')[0]}`;
    }
  }
}
