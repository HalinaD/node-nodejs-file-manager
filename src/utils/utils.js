import { changeWorkingDirectory, goUp, listDirectory } from '../working-directory/workingDirectory.js';
import { read, add, rename, copy, move, remove } from '../fs/fileSystem.js';
import { calculateHash } from '../hash/hash.js';
import { getEOL, getCPUsInfo, getHomeDirectory, getUsername, getArchitecture } from '../os/operatingSystem.js';
import { printCurrentWorkingDirectory } from '../working-directory/currentDirectory.js';
import { compress } from '../zip/compress.js';
import { decompress } from '../zip/decompress.js';

export async function displayWelcomeMessage(username) {
  console.log(`Welcome to the File Manager, ${username}!`);
  printCurrentWorkingDirectory();
}

export async function displayGoodbyeMessage(username) {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  printCurrentWorkingDirectory();
}

export async function processCommand(user, command) {
  const [operation, ...params] = command.split(' ');
  const targetPath = params.join(' ');

  switch (operation) {
    case 'cd':
      try {
        const newWorkingDirectory = await changeWorkingDirectory(targetPath);
        console.log(`You are currently in ${newWorkingDirectory}`);
      } catch (error) {
        console.error(error.message);
      }
      break;
    case '.exit':
      await displayGoodbyeMessage(user.username);
      process.exit();
      break;
    case 'up':
      try {
        const newWorkingDirectory = await goUp();
        console.log(`You are currently in ${newWorkingDirectory}`);
      } catch (error) {
        console.error('Operation failed');
      }
      break;
    case 'ls':
      try {
        await listDirectory();
      } catch (error) {
        console.error('Operation failed');
      }
      break;
    case 'cat':
      await read(targetPath);
      break;
    case 'add':
      await add(targetPath);
      break;
    case 'rn':
      await rename(...params);
      break;
    case 'cp':
      await copy(...params);
      break;
    case 'mv':
      await move(...params);
      break;
    case 'rm':
      await remove(targetPath);
      break;
    case 'hash':
      try {
        await calculateHash(targetPath);
      } catch (error) {
        console.error('Operation failed');
      }
      break;
    case 'os':
      printCurrentWorkingDirectory();
      try {
        switch (params[0]) {
          case '--EOL':
            getEOL();
            break;
          case '--cpus':
            getCPUsInfo();
            break;
          case '--homedir':
            getHomeDirectory();
            break;
          case '--username':
            getUsername();
            break;
          case '--architecture':
            getArchitecture();
            break;
          default:
            console.error('Invalid input');
            break;
          }
        } catch (error) {
          console.error('Operation failed');
        }
        break;
    case 'compress':
      try {
        const [sourcePath, destinationPath] = params;
        await compress(sourcePath, destinationPath);
      } catch (error) {
        console.error('Operation failed');
      }
      break;
    case 'decompress':
      try {
        const [sourcePath, destinationPath] = params;
        await decompress(sourcePath, destinationPath);
      } catch (error) {
        console.error('Operation failed');
      }
      break;
    default:
      console.error('Invalid input');
      printCurrentWorkingDirectory();
      break;
  }
  if (operation === 'ls') {
    printCurrentWorkingDirectory();
  }
}
