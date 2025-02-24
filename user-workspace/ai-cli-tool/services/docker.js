import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export class DockerService {
  constructor() {
    this.defaultDockerfile = `
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
`.trim();
  }

  async buildImage(options = {}) {
    const {
      dockerfile = this.defaultDockerfile,
      tag = 'latest',
      context = '.',
      optimize = true
    } = options;

    try {
      // Create optimized Dockerfile if optimization is enabled
      if (optimize) {
        dockerfile = await this._optimizeDockerfile(dockerfile);
      }

      // Write Dockerfile
      await fs.writeFile(path.join(context, 'Dockerfile'), dockerfile);

      // Build the image with optimizations
      const buildArgs = [
        'docker build',
        '--no-cache',
        '--compress',
        optimize ? '--squash' : '',
        `-t ${tag}`,
        context
      ].filter(Boolean).join(' ');

      const { stdout, stderr } = await execAsync(buildArgs);
      return { success: true, output: stdout, error: stderr };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async runContainer(options = {}) {
    const {
      image,
      name,
      ports = [],
      env = [],
      volumes = [],
      network,
      optimize = true
    } = options;

    try {
      // Prepare run command with optimizations
      const runArgs = [
        'docker run',
        '-d',  // Run in detached mode
        '--init',  // Use tini as init process
        optimize ? '--memory-swappiness=0' : '',  // Disable swap for better performance
        optimize ? '--cpu-shares=1024' : '',  // Set CPU priority
        name ? `--name ${name}` : '',
        ...ports.map(p => `-p ${p}`),
        ...env.map(e => `-e ${e}`),
        ...volumes.map(v => `-v ${v}`),
        network ? `--network ${network}` : '',
        image
      ].filter(Boolean).join(' ');

      const { stdout, stderr } = await execAsync(runArgs);
      return { success: true, containerId: stdout.trim(), error: stderr };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async _optimizeDockerfile(dockerfile) {
    // Apply Dockerfile optimizations
    const optimizations = [
      // Use multi-stage builds
      this._addMultiStageBuild,
      // Optimize layer caching
      this._optimizeLayers,
      // Add security hardening
      this._addSecurityHardening,
      // Add health checks
      this._addHealthCheck
    ];

    let optimizedDockerfile = dockerfile;
    for (const optimize of optimizations) {
      optimizedDockerfile = optimize(optimizedDockerfile);
    }

    return optimizedDockerfile;
  }

  _addMultiStageBuild(dockerfile) {
    if (!dockerfile.includes('FROM') || dockerfile.includes('AS builder')) {
      return dockerfile;
    }

    return `
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
`.trim();
  }

  _optimizeLayers(dockerfile) {
    // Group related commands to reduce layers
    return dockerfile.replace(
      /(RUN.*\n)+/g,
      (match) => `RUN ${match.split('\n').map(cmd => 
        cmd.replace('RUN ', '')).join(' && \\\n    ')}\n`
    );
  }

  _addSecurityHardening(dockerfile) {
    // Add security best practices
    return dockerfile + `
# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Add security options
LABEL security.nist.800-190="1.0"
ENV NODE_ENV=production
`.trim();
  }

  _addHealthCheck(dockerfile) {
    // Add health check
    return dockerfile + `
# Add health check
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1
`.trim();
  }

  async getContainerStats(containerId) {
    try {
      const { stdout } = await execAsync(`docker stats ${containerId} --no-stream --format "{{.CPUPerc}}\t{{.MemUsage}}"`);
      const [cpu, memory] = stdout.trim().split('\t');
      return { success: true, stats: { cpu, memory } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async stopContainer(containerId) {
    try {
      await execAsync(`docker stop ${containerId}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
