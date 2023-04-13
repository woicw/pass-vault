import { default as forge } from "node-forge";
import { writeFileContent, deleteFile } from "./file";
import inquirer from "inquirer";
import { Encryption } from "./types";
import { getPath } from "./utils";
import chalk from "chalk";
export const getAes = () => forge.random.getBytesSync(32);
export const createAes = async () => {
  const key = await getAes();
  await writeFileContent(getPath(Encryption.AES), forge.util.bytesToHex(key));
  const aesKey = forge.util.bytesToHex(key);
  console.log(chalk.red(`AES Private Key:`) + chalk.yellow(` ${aesKey}`));
  return aesKey;
};

export const decrypt = (key: string, encryptedString: string) =>
  new Promise((resolve, reject) => {
    if (!encryptedString || !key) {
      reject();
    }
    try {
      let iv = forge.util.hexToBytes(encryptedString.substring(0, 32));
      let encrypted = encryptedString.substring(32);
      let decipher = forge.cipher.createDecipher(
        "AES-CBC",
        forge.util.hexToBytes(key)
      );

      decipher.start({ iv: iv });
      decipher.update(
        forge.util.createBuffer(forge.util.hexToBytes(encrypted))
      );

      decipher.finish();
      let decrypted = decipher.output;
      resolve(decrypted.toString());
    } catch (error) {
      console.log(error, "error");
      reject(error);
    }
  });

export const encrypt = (key: string, text: string) =>
  new Promise((resolve, reject) => {
    if (!text || !key) {
      reject();
    }
    const realKey = forge.util.hexToBytes(key);
    try {
      let iv = forge.random.getBytesSync(16);
      let cipher = forge.cipher.createCipher("AES-CBC", realKey);
      cipher.start({ iv: iv });
      cipher.update(forge.util.createBuffer(text));
      cipher.finish();
      let encrypted = cipher.output;

      const result =
        forge.util.bytesToHex(iv) + forge.util.bytesToHex(encrypted.getBytes());

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

export const setAes = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "key",
      message: "Enter your key:",
    },
  ]);
  await writeFileContent(getPath(Encryption.AES), answers.key);
};

export const del = async () => deleteFile(getPath(Encryption.AES));
