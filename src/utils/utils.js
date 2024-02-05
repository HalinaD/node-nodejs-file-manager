import { getCurrentWorkingDirectory, changeWorkingDirectory, goUp, listDirectory } from '../working-directory/workingDirectory.js';
import { read, add, rename, copy, move, remove } from '../fs/fileSystem.js';
import { calculateHash } from '../hash/hash.js';

export async function displayWelcomeMessage(username) {
  const currentWorkingDirectory = await getCurrentWorkingDirectory();
  console.log(`Welcome to the File Manager, ${username}!`);
  console.log(`You are currently in ${currentWorkingDirectory}`);
}

export async function displayGoodbyeMessage(username) {
  const currentWorkingDirectory = await getCurrentWorkingDirectory();
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  console.log(`You are currently in ${currentWorkingDirectory}`);
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
    default:
      console.error('Operation failed');
      break;
  }
  if (operation === 'ls') {
    const currentWorkingDirectory = await getCurrentWorkingDirectory();
    console.log(`You are currently in ${currentWorkingDirectory}`);
  }
}
