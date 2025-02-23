import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export class OpenAIService {
  constructor(config = {}) {
    const apiKey = config.openaiApiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OpenAI API key not found in environment variables');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1'
    });
    
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  }

  async generateResponse(prompt) {
    try {
      if (!this.openai.apiKey) {
        throw new Error('OpenAI API key is not configured');
      }

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an aggressive and direct AI assistant that provides accurate and practical information with confidence and authority.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
        top_p: 0.95,
        frequency_penalty: 0.2,
        presence_penalty: 0.1
      });

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error('No response received from OpenAI');
      }

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      
      // Throw a more user-friendly error
      if (error.response?.status === 401) {
        throw new Error('OpenAI authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('OpenAI rate limit exceeded. Please try again later.');
      } else if (error.response) {
        throw new Error(`OpenAI API error (${error.response.status}): ${error.response.data?.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('Network error: Unable to reach OpenAI API');
      } else {
        throw new Error(`OpenAI error: ${error.message}`);
      }
    }
  }

  async generateStreamingResponse(prompt, onChunk) {
    try {
      if (!this.openai.apiKey) {
        throw new Error('OpenAI API key is not configured');
      }

      const stream = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that provides accurate and practical information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          onChunk(content);
        }
      }
    } catch (error) {
      console.error('OpenAI API streaming error:', error.message);
      throw error;
    }
  }
}
