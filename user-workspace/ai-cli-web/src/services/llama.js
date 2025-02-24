import Replicate from 'replicate';

export class LlamaService {
  constructor(apiKey = '3b22f61ba20abacebca325b1c3f6efd922f072ba942f7630ae31483a2bf730d') {
    this.replicate = new Replicate({
      auth: apiKey,
    });
  }

  async generateResponse(prompt) {
    try {
      const output = await this.replicate.run(
        "meta/llama-3.3370B-instruct-turbo",
        {
          input: {
            prompt,
            max_length: 500,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.1
          }
        }
      );

      return output.join('');
    } catch (error) {
      console.error('Llama API error:', error.message);
      throw error;
    }
  }
}
