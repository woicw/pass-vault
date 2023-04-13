import inquirer from "inquirer";
import chalk from "chalk";
import open from "open";
import {
  hasFileOrDir,
  writeFileContent,
  readFileContent,
  deleteFile,
  appendFileContent,
} from "./file";
import {
  setAes,
  encrypt as encryptAes,
  decrypt as decryptAes,
  createAes,
  del as delAes,
} from "./aes";
import { Encryption } from "./types";
import {
  setRsa,
  encrypt as encryptRsa,
  decrypt as decryptRsa,
  createRsa,
  del as delRsa,
} from "./rsa";
import { getPath, getCodeBookPath } from "./utils";

const typeOptions = new Map([
  [
    Encryption.AES,
    {
      set: setAes,
      encrypt: encryptAes,
      create: createAes,
      decrypt: decryptAes,
      del: delAes,
    },
  ],
  [
    Encryption.RSA,
    {
      set: setRsa,
      encrypt: encryptRsa,
      create: createRsa,
      decrypt: decryptRsa,
      del: delRsa,
    },
  ],
]);

export const set = async (method: Encryption) => {
  const path = getPath(method);
  const hasKey = await hasFileOrDir(path);
  if (hasKey) {
    const answers = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "File already exists. Overwrite?",
      },
    ]);
    if (answers.overwrite) {
      typeOptions.get(method)?.set?.();
    } else {
      process.exit(1);
    }
  } else {
    typeOptions.get(method)?.set?.();
  }
};

export const encrypt = async (
  code: string,
  method = Encryption.AES,
  key?: string,
  name?: string
) => {
  const path = getPath(method);
  const codeBookPath = getCodeBookPath();
  const hasKey = await hasFileOrDir(path);
  if (typeof key === "string") {
    const result = await typeOptions.get(method)?.encrypt?.(key, code);
    await appendFileContent(codeBookPath, `${name || "unknown"}: ${result}`);
    console.log(chalk.green(`Encryption successful.`));
    console.log(chalk.yellow(`Your  encrypted code:` + chalk.green(result)));
  } else if (hasKey) {
    const key = await readFileContent(path);
    const result = await typeOptions.get(method)?.encrypt?.(key, code);
    await appendFileContent(codeBookPath, `${name || "unknown"}: ${result}`);
    console.log(chalk.green(`Encryption successful.`));
    console.log(chalk.yellow(`Your  encrypted code:` + chalk.green(result)));
  } else {
    const key = (await typeOptions.get(method)?.create?.()) || "";
    const result = await typeOptions.get(method)?.encrypt?.(key, code);
    await appendFileContent(codeBookPath, `${name || "unknown"}: ${result}`);
    console.log(chalk.green(`Encryption successful.`));
    console.log(chalk.yellow(`Your  encrypted code:` + chalk.green(result)));
  }
};

export const decrypt = async (
  code: string,
  method = Encryption.AES,
  key?: string
) => {
  const path = getPath(
    method === Encryption.RSA ? `${method}.private` : method
  );
  const hasKey = await hasFileOrDir(path);
  if (typeof key === "string") {
    const result = await typeOptions.get(method)?.decrypt?.(key, code);
    console.log(chalk.green(`Decryption successful.`));
    console.log(chalk.yellow(`Your  encrypted code:`) + chalk.green(result));
  } else if (hasKey) {
    const key = await readFileContent(path);
    const result = await typeOptions.get(method)?.decrypt?.(key, code);
    console.log(chalk.green(`Decryption successful.`));
    console.log(chalk.yellow(`Your  encrypted code:`) + chalk.green(result));
  } else {
    console.log(
      chalk.yellow(`You have not yet set up the decryption private key`)
    );
  }
};
export const del = async (method = Encryption.AES) => {
  const path = getPath(
    method === Encryption.RSA ? `${method}.private` : method
  );
  const hasKey = await hasFileOrDir(path);
  if (hasKey) {
    const answers = await inquirer.prompt([
      {
        type: "confirm",
        name: "deleteKey",
        message: "Are you sure you want to delete the public/private key?",
      },
    ]);
    if (answers.deleteKey) {
      await typeOptions.get(method)?.del?.();
      console.log(chalk.green("Deletion successful."));
    }
  } else {
    console.log(
      "The specified type of public/private key has not been generated locally."
    );
  }
};

export const exp = async (path: string) => {
  const codeBookPath = getCodeBookPath();
  const hasBook = await hasFileOrDir(codeBookPath);
  if (hasBook) {
    try {
      const book = await readFileContent(codeBookPath);
      await writeFileContent(`${path}/code-book.txt`, book);
      console.log(chalk.green("Password book exported successfully."));
      open(path);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Password book is not saved locally.");
  }
};
