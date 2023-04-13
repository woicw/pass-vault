import inquirer from "inquirer";
import {  writeFileContent, readFileContent, deleteFile } from "./file";
import { Encryption } from "./types";

export const getPath = (path:string) => `${process.cwd()}/.pass/${path}.key.txt`;

export const getCodeBookPath = () => `${process.cwd()}/.pass/code-book.txt`;