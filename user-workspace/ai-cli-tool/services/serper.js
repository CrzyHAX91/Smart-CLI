import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export class SerperService {
  constructor(config = {}) {
    this.apiKey = config.serperApiKey || process.env.SERPER_API_KEY;
    this.baseUrl = 'https://google.serper.dev/search';
    
    if (!this.apiKey) {
      throw new Error('Serper API key is not configured');
    }
  }

  async search(query) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: query,
          num: 5, // Get top 5 results
          gl: 'us', // Set region to US
          hl: 'en'  // Set language to English
        })
      });

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Format the search results
      const formattedResults = this.formatResults(data);
      return formattedResults;
    } catch (error) {
      console.error('Search error:', error.message);
      throw error;
    }
  }

  formatResults(data) {
    const results = [];

    // Add knowledge graph if available
    if (data.knowledgeGraph) {
      results.push('🎯 Knowledge Graph:');
      results.push(`${data.knowledgeGraph.title}: ${data.knowledgeGraph.description || ''}`);
      
      if (data.knowledgeGraph.attributes) {
        Object.entries(data.knowledgeGraph.attributes).forEach(([key, value]) => {
          results.push(`• ${key}: ${value}`);
        });
      }
      results.push(''); // Add spacing
    }

    // Add organic search results
    if (data.organic) {
      results.push('🔍 Search Results:');
      data.organic.forEach((result, index) => {
        results.push(`\n${index + 1}. ${result.title.toUpperCase()}`);
        results.push(`   ${result.snippet}`);
        if (result.rating) {
          results.push(`   Rating: ${'⭐'.repeat(Math.round(result.rating))}`);
        }
        results.push(`   🔗 ${result.link}`);
      });
    }

    // Add related searches if available
    if (data.relatedSearches) {
      results.push('\n📌 Related Searches:');
      data.relatedSearches.slice(0, 5).forEach(search => {
        results.push(`• ${search}`);
      });
    }

    return results.join('\n');
  }
}
