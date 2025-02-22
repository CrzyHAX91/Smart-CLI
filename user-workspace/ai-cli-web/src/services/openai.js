import OpenAI from 'openai';

export class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
    });
    
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  }

  async generateResponse(prompt) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant powered by Meta-Llama.'
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
        presence_penalty: 0
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      throw error;
    }
  }
}
