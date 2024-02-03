import path from 'path';
import fs from 'fs/promises';
import os from 'os';

let currentWorkingDirectory = process.cwd();

export async function getCurrentWorkingDirectory() {
  return currentWorkingDirectory;
}

export async function setWorkingDirectory() {
  const homeDirectory = os.homedir();
  currentWorkingDirectory = homeDirectory;
  return currentWorkingDirectory;
}

export async function isValidPath(targetPath) {
  const fullPath = path.resolve(currentWorkingDirectory, targetPath);
  return fullPath.startsWith(await fs.realpath(process.cwd()));
}

export async function changeWorkingDirectory(targetPath) {
  const fullPath = path.resolve(currentWorkingDirectory, targetPath);
  try {
    const stats = await fs.stat(fullPath);
    if (!stats.isDirectory()) {
      throw new Error('Invalid input');
    }
    currentWorkingDirectory = await fs.realpath(fullPath);
    return currentWorkingDirectory;
  } catch (error) {
    throw new Error('Operation failed');
  }
}