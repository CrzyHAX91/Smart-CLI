#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

async function syncVersions() {
  try {
    // Read package.json
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    const version = packageJson.version;

    // Update version in index.js
    const indexPath = path.join(rootDir, 'src', 'index.js');
    let indexContent = await fs.readFile(indexPath, 'utf8');
    
    // Replace version in .version() call
    indexContent = indexContent.replace(
      /\.version\(['"]([\d.]+)['"]\)/,
      `.version('${version}')`
    );

    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log(`✓ Successfully synchronized version ${version} across files`);

  } catch (error) {
    console.error('Error synchronizing versions:', error);
    process.exit(1);
  }
}

syncVersions();
