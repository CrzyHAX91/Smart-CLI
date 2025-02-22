import Replicate from 'replicate';

export class LlamaService {
  constructor(apiKey) {
    this.replicate = new Replicate({
      auth: apiKey,
    });
  }

  async generateResponse(prompt) {
    try {
      const output = await this.replicate.run(
        "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
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
