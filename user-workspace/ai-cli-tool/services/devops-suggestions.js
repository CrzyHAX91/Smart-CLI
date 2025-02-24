import { OpenAIService } from './openai.js';
import yaml from 'js-yaml';
import chalk from 'chalk';
import boxen from 'boxen';

export class DevOpsSuggestionsService {
  constructor(config) {
    this.openai = new OpenAIService(config.openaiApiKey);
    this.suggestionCache = new Map();
  }

  async analyzeKubernetesConfig(yamlContent) {
    const cacheKey = `k8s-${Buffer.from(yamlContent).toString('base64')}`;
    if (this.suggestionCache.has(cacheKey)) {
      return this.suggestionCache.get(cacheKey);
    }

    try {
      const config = yaml.load(yamlContent);
      const prompt = this._buildK8sAnalysisPrompt(config);
      const suggestions = await this.openai.generateResponse(prompt);
      const parsed = JSON.parse(suggestions);
      this.suggestionCache.set(cacheKey, parsed);
      return parsed;
    } catch (error) {
      console.error('Error analyzing Kubernetes config:', error);
      return this._getDefaultK8sSuggestions();
    }
  }

  async analyzeDockerfile(dockerfileContent) {
    const cacheKey = `docker-${Buffer.from(dockerfileContent).toString('base64')}`;
    if (this.suggestionCache.has(cacheKey)) {
      return this.suggestionCache.get(cacheKey);
    }

    try {
      const prompt = this._buildDockerAnalysisPrompt(dockerfileContent);
      const suggestions = await this.openai.generateResponse(prompt);
      const parsed = JSON.parse(suggestions);
      this.suggestionCache.set(cacheKey, parsed);
      return parsed;
    } catch (error) {
      console.error('Error analyzing Dockerfile:', error);
      return this._getDefaultDockerSuggestions();
    }
  }

  _buildK8sAnalysisPrompt(config) {
    return `Analyze this Kubernetes configuration and provide optimization suggestions:
    ${JSON.stringify(config)}
    
    Return JSON with:
    {
      "security": ["security improvement suggestions"],
      "performance": ["performance optimization suggestions"],
      "reliability": ["reliability improvement suggestions"],
      "scalability": ["scalability recommendations"],
      "bestPractices": ["general best practices suggestions"]
    }`;
  }

  _buildDockerAnalysisPrompt(dockerfile) {
    return `Analyze this Dockerfile and provide optimization suggestions:
    ${dockerfile}
    
    Return JSON with:
    {
      "security": ["security improvement suggestions"],
      "performance": ["performance optimization suggestions"],
      "size": ["image size reduction suggestions"],
      "caching": ["layer caching optimization suggestions"],
      "bestPractices": ["general best practices suggestions"]
    }`;
  }

  _getDefaultK8sSuggestions() {
    return {
      security: [
        'Enable RBAC for access control',
        'Use network policies to restrict traffic',
        'Configure resource limits'
      ],
      performance: [
        'Configure resource requests appropriately',
        'Use horizontal pod autoscaling',
        'Implement liveness and readiness probes'
      ],
      reliability: [
        'Use pod disruption budgets',
        'Implement proper health checks',
        'Configure pod anti-affinity'
      ],
      scalability: [
        'Use deployments for rolling updates',
        'Configure horizontal pod autoscaling',
        'Implement proper resource quotas'
      ],
      bestPractices: [
        'Use namespaces for resource organization',
        'Implement proper labels and annotations',
        'Use configmaps and secrets for configuration'
      ]
    };
  }

  _getDefaultDockerSuggestions() {
    return {
      security: [
        'Use specific version tags instead of latest',
        'Run containers as non-root user',
        'Implement health checks'
      ],
      performance: [
        'Use multi-stage builds',
        'Optimize layer caching',
        'Minimize the number of layers'
      ],
      size: [
        'Use alpine-based images',
        'Remove unnecessary files',
        'Clean up package manager caches'
      ],
      caching: [
        'Order commands by change frequency',
        'Combine RUN commands',
        'Use .dockerignore file'
      ],
      bestPractices: [
        'Use COPY instead of ADD',
        'Set proper WORKDIR',
        'Define proper EXPOSE ports'
      ]
    };
  }

  displaySuggestions(suggestions, type = 'kubernetes') {
    const title = type === 'kubernetes' ? '🎯 Kubernetes Optimization Suggestions' : '🐳 Docker Optimization Suggestions';
    
    console.log(boxen(chalk.bold.cyan(title), {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'cyan'
    }));

    Object.entries(suggestions).forEach(([category, items]) => {
      const emoji = this._getCategoryEmoji(category);
      console.log(boxen(
        `${chalk.bold.yellow(emoji + ' ' + category.toUpperCase())}\n\n${items.map(item => 
          chalk.white('• ' + item)).join('\n')}`,
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'yellow'
        }
      ));
    });
  }

  _getCategoryEmoji(category) {
    const emojis = {
      security: '🔒',
      performance: '⚡',
      reliability: '🎯',
      scalability: '📈',
      bestPractices: '✨',
      size: '📦',
      caching: '💾'
    };
    return emojis[category.toLowerCase()] || '🔧';
  }
}
