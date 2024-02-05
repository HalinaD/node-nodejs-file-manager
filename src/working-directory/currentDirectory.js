import { getCurrentWorkingDirectory } from './workingDirectory.js';

export async function printCurrentWorkingDirectory() {
  const currentWorkingDirectory = await getCurrentWorkingDirectory();
  console.log(`You are currently in ${currentWorkingDirectory}`);
}