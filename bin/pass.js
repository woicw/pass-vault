import { Command } from "commander";
import { set, encrypt, decrypt, del, exp } from "../lib/esm/index.js";
const program = new Command();

program.version("0.0.1");

program
  .command("set")
  .description("Setting up public and private keys")
  .argument("<method>", "Encryption methods")
  .action(async (method) => {
    await set(method);
  });

program
  .command("ept")
  .description("Encryption command")
  .argument("<code>", "String to be encrypted")
  .option("-m, --method [method]", "Encryption methods")
  .option("-k, --key [key]", "Encryption public/private key")
  .option("-n, --name [name]", "Encryption public/private key")
  .action(async (code, opts) => {
    await encrypt(code, opts.method, opts.key, opts.name);
  });

program
  .command("dpt")
  .description("Decryption command")
  .argument("<code>", "String to be decrypted")
  .option("-m, --method [method]", "Decryption method")
  .option("-k, --key [key]", "Decryption Key")
  .action(async (code, opts) => {
    await decrypt(code, opts.method, opts.key);
  });
program
  .command("del")
  .description("Delete Configuration")
  .option("-m, --method [method]", "Encryption methods")
  .action(async (opts) => {
    await del(opts.method);
  });
program
  .command("exp")
  .argument("<path>", "Export file path")
  .description("Export Password Vault")
  .action(async (path) => {
    await exp(path);
  });

program.parseAsync(process.argv);
