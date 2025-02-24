export class SerperService {
  constructor(apiKey = 'ada101ab0e19cbd984caf03b69b54e94b54bf20d') {
    this.apiKey = apiKey;
    this.baseUrl = 'https://google.serper.dev/search';
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
          num: 5,
          gl: 'us',
          hl: 'en'
        })
      });

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const data = await response.json();
      return this.formatResults(data);
    } catch (error) {
      console.error('Search error:', error.message);
      throw error;
    }
  }

  formatResults(data) {
    const results = [];

    if (data.organic) {
      results.push('Search Results:');
      data.organic.forEach((result, index) => {
        results.push(`\n${index + 1}. ${result.title}`);
        results.push(`   ${result.snippet}`);
        results.push(`   URL: ${result.link}`);
      });
    }

    if (data.knowledgeGraph) {
      results.push('\nKnowledge Graph:');
      results.push(`   ${data.knowledgeGraph.title}: ${data.knowledgeGraph.description || ''}`);
    }

    return results;
  }
}
