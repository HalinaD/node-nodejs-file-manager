import { promises as fsPromises, createReadStream, createWriteStream } from 'fs';
import path from 'path';
import { getCurrentWorkingDirectory } from '../working-directory/workingDirectory.js';

export async function read(filePath) {
  try {
    const currentWorkingDirectory = await getCurrentWorkingDirectory();
    const fullPath = path.resolve(currentWorkingDirectory, filePath);
    const readStream = createReadStream(fullPath, 'utf-8');

    readStream.pipe(process.stdout);
    readStream.on('end', async () => {
      console.log('');
      await printCurrentWorkingDirectory();
    });
    readStream.on('error', (error) => {
      handleError(error);
      printCurrentWorkingDirectory();
    });
  } catch (error) {
    handleError(error);
  }
}

export async function add(fileName) {
  const fullPath = path.resolve(await getCurrentWorkingDirectory(), fileName);
  try {
    await fsPromises.writeFile(fullPath, '');
  } catch (error) {
    handleError(error);
  }
  printCurrentWorkingDirectory();
}

export async function rename(oldPath, newName) {
  const fullPathOld = path.resolve(await getCurrentWorkingDirectory(), oldPath);
  const fullPathNew = path.resolve(await getCurrentWorkingDirectory(), newName);
  try {
    await fsPromises.rename(fullPathOld, fullPathNew);
  } catch (error) {
    handleError(error);
  }
  printCurrentWorkingDirectory();
}

async function createReadStreamAndWriteStream(sourcePath, destinationPath, isMove) {
  const currentWorkingDirectory = await getCurrentWorkingDirectory();
  const fullSourcePath = path.resolve(currentWorkingDirectory, sourcePath);
  const fullDestinationPath = path.resolve(currentWorkingDirectory, destinationPath, path.basename(fullSourcePath));

  try {
    const sourceStat = await fsPromises.stat(fullSourcePath);
    const destinationExists = await fsPromises.access(path.dirname(fullDestinationPath)).then(() => true).catch(() => false);

    if (sourceStat.isFile() && destinationExists) {
      const readStream = createReadStream(fullSourcePath);
      const writeStream = createWriteStream(fullDestinationPath);

      const handleError = (error) => {
        console.error('Operation failed');
        readStream.destroy(error);
        writeStream.destroy(error);
      };

      let errorHandled = false;

      const handleFinish = async () => {
        if (isMove) {
          try {
            await fsPromises.unlink(fullSourcePath);
          } catch (unlinkError) {
            if (!errorHandled) {
              handleError(unlinkError);
              errorHandled = true;
            }
          }
        }
        printCurrentWorkingDirectory();
      };

      readStream.on('error', handleFinish);
      writeStream.on('error', handleFinish);

      writeStream.on('finish', handleFinish);

      readStream.pipe(writeStream);
    } else {
      console.error('Operation failed');
      printCurrentWorkingDirectory();
    }
  } catch (error) {
    console.error('Operation failed');
    printCurrentWorkingDirectory();
  }
}
  
export function copy(sourcePath, destinationPath) {
  createReadStreamAndWriteStream(sourcePath, destinationPath, false);
}

export function move(sourcePath, destinationPath) {
  createReadStreamAndWriteStream(sourcePath, destinationPath, true);
}

export async function remove(filePath) {
  const fullPath = path.resolve(await getCurrentWorkingDirectory(), filePath);
  try {
    await fsPromises.unlink(fullPath);
  } catch (error) {
    console.error('Operation failed');
  }
  printCurrentWorkingDirectory();
}

export async function printCurrentWorkingDirectory() {
  const currentWorkingDirectory = await getCurrentWorkingDirectory();
  console.log(`You are currently in ${currentWorkingDirectory}`);
}

function handleError(error) {
  console.error('Operation failed');
}
