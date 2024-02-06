import os from 'os';

export function getEOL() {
  const eol = os.EOL;
  console.log(`${JSON.stringify(eol)}`);
}

export function getCPUsInfo() {
  const cpus = os.cpus();
  const cpuInfoArray = [];

  cpus.forEach((cpu, index) => {
    const cpuInfo = {
      cpu: `${index + 1}`,
      model: cpu.model.split('@')[0].trim(),
      speed: `${(cpu.speed / 1000).toFixed(2)} GHz`,
    };
    cpuInfoArray.push(cpuInfo);
  });
  console.log(cpuInfoArray);
}

export function getHomeDirectory() {
  const homeDir = os.homedir();
  console.log(`${homeDir}`);
}

export function getUsername() {
  const username = os.userInfo().username;
  console.log(`${username}`);
}

export function getArchitecture() {
  const arch = os.arch();
  console.log(`${arch}`);
}
