import {
  appendFile,
  readFile,
  unlink,
  access,
  constants,
  mkdir,
  writeFile,
} from "node:fs/promises";
import os from "node:os";

export const readFileContent = async (path: string) => {
  const buffer = await readFile(path);
  return buffer.toString();
};
export const deleteFile = async (path: string) => {
  await unlink(path);
};

export const hasFileOrDir = async (path: string) => {
  try {
    await access(path, constants.R_OK | constants.W_OK);
    return true;
  } catch {
    return false;
  }
};

export const writeFileContent = async (path: string, content: string) => {
  const dirPath = path.split("/").slice(0, -1).join("/");
  const hasDir = await hasFileOrDir(dirPath);
  !hasDir && (await mkdir(dirPath, { recursive: true }));
  await writeFile(path, content);
};

export const appendFileContent = async (path: string, content: string) => {
  const dirPath = path.split("/").slice(0, -1).join("/");
  const hasDir = await hasFileOrDir(dirPath);
  !hasDir && (await mkdir(dirPath, { recursive: true }));
  await appendFile(path, `${content}${os.EOL}`);
};
