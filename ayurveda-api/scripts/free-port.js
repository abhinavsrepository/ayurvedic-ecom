#!/usr/bin/env node

const { execSync } = require('node:child_process');

const portArg = process.argv[2] || process.env.PORT || '3333';
const port = Number.parseInt(portArg, 10);

if (!Number.isInteger(port) || port <= 0) {
  console.error(`[free-port] Invalid port: ${portArg}`);
  process.exit(1);
}

const killPid = (pid) => {
  if (!pid || pid === process.pid) return;

  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    } else {
      process.kill(pid, 'SIGKILL');
    }
    console.log(`[free-port] Killed process ${pid} on port ${port}`);
  } catch {
    // Ignore kill failures (process may have exited)
  }
};

const getPidsWindows = () => {
  const out = execSync(`netstat -ano -p tcp | findstr :${port}`, { encoding: 'utf8' });
  const pids = new Set();
  for (const line of out.split(/\r?\n/)) {
    if (!line || !line.includes('LISTENING')) continue;
    const cols = line.trim().split(/\s+/);
    const pid = Number.parseInt(cols[cols.length - 1], 10);
    if (Number.isInteger(pid)) pids.add(pid);
  }
  return [...pids];
};

const getPidsUnix = () => {
  const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' });
  return out
    .split(/\r?\n/)
    .map((v) => Number.parseInt(v, 10))
    .filter((v) => Number.isInteger(v));
};

try {
  const pids =
    process.platform === 'win32'
      ? getPidsWindows()
      : getPidsUnix();

  if (pids.length === 0) {
    console.log(`[free-port] Port ${port} is already free`);
    process.exit(0);
  }

  for (const pid of pids) {
    killPid(pid);
  }
} catch {
  console.log(`[free-port] Port ${port} is already free`);
}

