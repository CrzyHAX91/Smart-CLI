import OpenAI from 'openai';

export class OpenAIService {
  constructor(apiKey = '3b22f61ba20abacebca325b1c3f6efd922f072ba942f7630ae31483a2bf730d') {
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.openai.com/v1',
    });
    
    this.model = 'gpt-3.5-turbo';
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
