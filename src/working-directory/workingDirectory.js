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

export async function goUp() {
  const parentDirectory = path.resolve(currentWorkingDirectory, '..');
  if (parentDirectory !== currentWorkingDirectory) {
    currentWorkingDirectory = await fs.realpath(parentDirectory);
  }
  return currentWorkingDirectory;
}

export async function listDirectory() {
  const files = await fs.readdir(currentWorkingDirectory);
  const sortedFiles = files.sort();

  const table = [];

  for (const [index, file] of sortedFiles.entries()) {
    const fullPath = path.resolve(currentWorkingDirectory, file);

    try {
      const stats = await fs.stat(fullPath);
      let quotedFile = `${file}`;

      const fileType = stats.isDirectory() ? 'directory' : 'file';

      table.push({ Name: quotedFile, Type: fileType });
    } catch (error) {
      console.error('Operation failed');
    }
  }

  table.sort((a, b) => {
    if (a.Type === b.Type) {
      return a.Name.localeCompare(b.Name);
    }
    return a.Type.localeCompare(b.Type);
  });

  console.table(table);
}
