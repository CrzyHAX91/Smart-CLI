import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

export class LlamaService {
  constructor() {
    const apiToken = process.env.REPLICATE_API_TOKEN || process.env.LLAMA_API_KEY;
    if (!apiToken) {
      throw new Error('Replicate API token is not configured');
    }

    this.replicate = new Replicate({
      auth: apiToken
    });

    // Using a publicly available model
    this.modelVersion = "replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1";
  }

  async generateResponse(prompt) {
    try {
      if (!this.replicate.auth) {
        throw new Error('Replicate API token is not configured');
      }

      const output = await this.replicate.run(
        this.modelVersion,
        {
          input: {
            prompt: `[INST] ${prompt} [/INST]`,
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.1,
            system_prompt: "You are a helpful AI assistant. Provide accurate and concise responses."
          }
        }
      );

      if (!output) {
        throw new Error('No response received from Llama model');
      }

      // Handle both array and string responses
      return Array.isArray(output) ? output.join('') : output;
    } catch (error) {
      console.error('Llama API error:', error.message);
      
      // Throw a more user-friendly error
      if (error.response?.status === 401) {
        throw new Error('Replicate authentication failed. Please check your API token.');
      } else if (error.response?.status === 429) {
        throw new Error('Replicate rate limit exceeded. Please try again later.');
      } else if (error.response?.status === 422) {
        throw new Error('Invalid model version or configuration. Please check your settings.');
      } else if (error.response) {
        throw new Error(`Replicate API error (${error.response.status}): ${error.response.data?.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('Network error: Unable to reach Replicate API');
      } else {
        throw new Error(`Llama error: ${error.message}`);
      }
    }
  }

  async generateStreamingResponse(prompt, onChunk) {
    try {
      if (!this.replicate.auth) {
        throw new Error('Replicate API token is not configured');
      }

      const stream = await this.replicate.stream(
        this.modelVersion,
        {
          input: {
            prompt: `[INST] ${prompt} [/INST]`,
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.1,
            system_prompt: "You are a helpful AI assistant. Provide accurate and concise responses."
          }
        }
      );

      for await (const chunk of stream) {
        onChunk(chunk);
      }
    } catch (error) {
      console.error('Llama API streaming error:', error.message);
      throw error;
    }
  }
}
