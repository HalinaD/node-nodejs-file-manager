import { createReadStream, promises as fsPromises } from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { printCurrentWorkingDirectory } from '../fs/fileSystem.js'

export async function calculateHash(filePath) {
  const currentWorkingDirectory = process.cwd();
  const fullPath = path.resolve(currentWorkingDirectory, filePath);

  try {
    const fileStream = createReadStream(fullPath);
    const hash = createHash('sha256');

    fileStream.on('data', (chunk) => {
      hash.update(chunk);
    });

    fileStream.on('end', () => {
      const fileHash = hash.digest('hex');
      console.log(`${fileHash}`);
      printCurrentWorkingDirectory();
    });

    fileStream.on('error', (error) => {
      console.error('Operation failed');
      printCurrentWorkingDirectory();
    });
  } catch (error) {
    console.error('Operation failed');
    printCurrentWorkingDirectory();
  }
}
