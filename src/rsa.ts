import inquirer from "inquirer";
import { default as forge } from "node-forge";
import { deleteFile, writeFileContent } from "./file";
import { Encryption } from "./types";
import { getPath } from "./utils";
import chalk from "chalk";
export const getRsa = () =>
  new Promise<{ privateKey: string; publicKey: string }>((resolve, reject) => {
    try {
      const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
      const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
      const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
      resolve({
        privateKey,
        publicKey,
      });
    } catch (error) {
      reject(error);
    }
  });

export const createRsa = async () => {
  const { privateKey, publicKey } = await getRsa();
  const privateKeyBase64 = forge.util.encode64(privateKey);
  const publicKeyBase64 = forge.util.encode64(publicKey);
  await writeFileContent(
    getPath(`${Encryption.RSA}.private`),
    privateKeyBase64
  );
  await writeFileContent(getPath(Encryption.RSA), publicKeyBase64);
  console.log(
    chalk.red(`RSA Private Key:`) + chalk.yellow(` ${privateKeyBase64}`)
  );
  console.log(
    chalk.red(`RSA Public Key:`) + chalk.yellow(` ${publicKeyBase64}`)
  );
  return publicKeyBase64;
};

export const decrypt = (privateKeyBase64: string, text: string) =>
  new Promise((resolve, reject) => {
    if (!privateKeyBase64 || !text) {
      reject();
    }
    try {
      const privateKeyPem = forge.util.decode64(privateKeyBase64);
      const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
      const encrypted = forge.util.decode64(text);
      const decrypted = privateKey.decrypt(encrypted);
      resolve(decrypted);
    } catch (error) {
      reject(error);
    }
  });

export const encrypt = (publicKeyBase64: string, text: string) =>
  new Promise((resolve, reject) => {
    if (!publicKeyBase64 || !text) {
      reject();
    }
    try {
      const publickeyPem = forge.util.decode64(publicKeyBase64);
      const publicKey = forge.pki.publicKeyFromPem(publickeyPem);
      const encrypted = publicKey.encrypt(text);
      resolve(forge.util.encode64(encrypted));
    } catch (error) {
      reject(error);
    }
  });

export const setRsa = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "privateKey",
      message: "Enter your key:",
    },
    {
      type: "input",
      name: "key",
      message: "Enter your Pubkey:",
    },
  ]);
  await writeFileContent(
    getPath(`${Encryption.RSA}.private`),
    answers.privateKey
  );
  await writeFileContent(getPath(`${Encryption.RSA}`), answers.key);
};

export const del = async () => {
  await deleteFile(getPath(Encryption.RSA));
  await deleteFile(getPath(`${Encryption.RSA}.private`));
};
