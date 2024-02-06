import { promises as fsPromises, createReadStream, createWriteStream } from 'fs';
import { createBrotliDecompress } from 'zlib';
import { printCurrentWorkingDirectory } from '../working-directory/currentDirectory.js';

export async function decompress(sourcePath, destinationPath) {
  try {
    await fsPromises.access(sourcePath);
    const readStream = createReadStream(sourcePath);
    const writeStream = createWriteStream(destinationPath);
    const brotliDecompress = createBrotliDecompress();
    readStream.pipe(brotliDecompress).pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  } catch (error) {
    console.error('Operation failed');
  }
  printCurrentWorkingDirectory();
}
