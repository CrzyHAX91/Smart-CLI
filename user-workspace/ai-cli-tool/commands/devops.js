import { KubernetesService } from '../services/kubernetes.js';
import { DockerService } from '../services/docker.js';
import { DevOpsSuggestionsService } from '../services/devops-suggestions.js';
import { getConfig } from '../utils/config.js';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

export const generateK8sConfig = async (options) => {
  const spinner = ora('Generating Kubernetes configuration...').start();
  
  try {
    const k8sService = new KubernetesService();
    const suggestions = new DevOpsSuggestionsService(getConfig());
    
    // Generate Kubernetes YAML files
    const deploymentResult = await k8sService.generateDeployment(
      options.name,
      options.image,
      options.replicas
    );

    const serviceResult = await k8sService.generateService(
      options.name,
      options.serviceType
    );

    spinner.succeed('Generated Kubernetes configuration files');

    // Analyze and provide suggestions
    const deploymentYaml = await fs.readFile(`${options.name}-deployment.yaml`, 'utf8');
    const k8sSuggestions = await suggestions.analyzeKubernetesConfig(deploymentYaml);
    
    console.log('\n');
    suggestions.displaySuggestions(k8sSuggestions, 'kubernetes');

  } catch (error) {
    spinner.fail(chalk.red('Error generating Kubernetes configuration'));
    console.error(chalk.red(`Error details: ${error.message}`));
  }
};

export const handleDocker = async (options) => {
  const spinner = ora('Processing Docker operation...').start();
  
  try {
    const dockerService = new DockerService();
    const suggestions = new DevOpsSuggestionsService(getConfig());

    if (options.build) {
      spinner.text = 'Building Docker image...';
      
      // Read Dockerfile if it exists, otherwise use default
      let dockerfile = '';
      try {
        dockerfile = await fs.readFile('Dockerfile', 'utf8');
      } catch {
        dockerfile = dockerService.defaultDockerfile;
      }

      // Get optimization suggestions before building
      const dockerSuggestions = await suggestions.analyzeDockerfile(dockerfile);
      spinner.succeed('Analyzed Dockerfile');
      console.log('\n');
      suggestions.displaySuggestions(dockerSuggestions, 'docker');

      // Build the image
      spinner.start('Building optimized Docker image...');
      const buildResult = await dockerService.buildImage({
        dockerfile,
        tag: options.tag,
        optimize: true
      });

      if (buildResult.success) {
        spinner.succeed(chalk.green('Successfully built Docker image'));
      } else {
        spinner.fail(chalk.red(`Failed to build Docker image: ${buildResult.error}`));
      }
    }

    if (options.run) {
      spinner.start('Running container with optimized settings...');
      const runResult = await dockerService.runContainer({
        image: options.image,
        name: options.name,
        ports: options.ports,
        env: options.env,
        volumes: options.volumes,
        network: options.network,
        optimize: true
      });

      if (runResult.success) {
        spinner.succeed(chalk.green(`Successfully started container: ${runResult.containerId}`));
        
        // Show container stats
        const stats = await dockerService.getContainerStats(runResult.containerId);
        if (stats.success) {
          console.log(chalk.cyan('\nContainer Stats:'));
          console.log(chalk.white(`CPU Usage: ${stats.stats.cpu}`));
          console.log(chalk.white(`Memory Usage: ${stats.stats.memory}`));
        }
      } else {
        spinner.fail(chalk.red(`Failed to run container: ${runResult.error}`));
      }
    }

  } catch (error) {
    spinner.fail(chalk.red('Error in Docker operation'));
    console.error(chalk.red(`Error details: ${error.message}`));
  }
};

export const analyzeInfrastructure = async (options) => {
  const spinner = ora('Analyzing infrastructure...').start();
  
  try {
    const suggestions = new DevOpsSuggestionsService(getConfig());
    
    if (options.kubernetes) {
      spinner.text = 'Analyzing Kubernetes configurations...';
      const files = await fs.readdir(options.path || '.');
      const k8sFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
      
      for (const file of k8sFiles) {
        const content = await fs.readFile(path.join(options.path || '.', file), 'utf8');
        const k8sSuggestions = await suggestions.analyzeKubernetesConfig(content);
        
        console.log(chalk.cyan(`\nAnalysis for ${file}:`));
        suggestions.displaySuggestions(k8sSuggestions, 'kubernetes');
      }
    }

    if (options.docker) {
      spinner.text = 'Analyzing Dockerfile...';
      const dockerfile = await fs.readFile('Dockerfile', 'utf8');
      const dockerSuggestions = await suggestions.analyzeDockerfile(dockerfile);
      
      console.log(chalk.cyan('\nDockerfile Analysis:'));
      suggestions.displaySuggestions(dockerSuggestions, 'docker');
    }

    spinner.succeed('Infrastructure analysis complete');

  } catch (error) {
    spinner.fail(chalk.red('Error analyzing infrastructure'));
    console.error(chalk.red(`Error details: ${error.message}`));
  }
};
