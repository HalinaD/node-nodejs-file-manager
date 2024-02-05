import { promises as fsPromises, createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress } from 'zlib';
import { printCurrentWorkingDirectory } from '../working-directory/currentDirectory.js';

export async function compress(sourcePath, destinationPath) {
  try {
    await fsPromises.access(sourcePath);
    const readStream = createReadStream(sourcePath);
    const writeStream = createWriteStream(destinationPath);
    const brotliCompress = createBrotliCompress();
    readStream.pipe(brotliCompress).pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  } catch (error) {
    console.error('Operation failed');
  }
  printCurrentWorkingDirectory();
}
