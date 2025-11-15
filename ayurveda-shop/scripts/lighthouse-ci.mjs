#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import http from 'http';

const execAsync = promisify(exec);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const LIGHTHOUSE_CONFIG = {
  ci: {
    collect: {
      url: [
        `${SITE_URL}/`,
        `${SITE_URL}/shop`,
        `${SITE_URL}/product/ashwagandha`,
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

async function runLighthouse() {
  try {
    console.log('Starting Lighthouse CI...');
    console.log(`Testing URLs at: ${SITE_URL}`);
    
    // Check if server is running
    try {
      await new Promise((resolve, reject) => {
        http.get(SITE_URL, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject(new Error(`Server returned status ${res.statusCode}`));
          }
        }).on('error', reject);
      });
      console.log('✓ Server is running');
    } catch (error) {
      console.error(`✗ Cannot reach server at ${SITE_URL}`);
      console.log('Please start the Next.js server first: pnpm start');
      process.exit(1);
    }

    // Run Lighthouse CI
    console.log('Running Lighthouse audits...');
    const { stdout, stderr } = await execAsync(
      `npx @lhci/cli@0.13.x autorun`
    );
    
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('✅ Lighthouse CI completed successfully!');
  } catch (error) {
    console.error('❌ Lighthouse CI failed:', error.message);
    process.exit(1);
  }
}

runLighthouse();
