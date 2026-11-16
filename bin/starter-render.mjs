#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const starterRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const hasStarter = args.some((arg) => arg === '--starter' || arg.startsWith('--starter='));
let rendererCli;
try {
  rendererCli = fileURLToPath(new URL('./cli.js', import.meta.resolve('@mood481/starter-renderer')));
} catch (error) {
  console.error(`Cannot resolve @mood481/starter-renderer: ${error.message}`);
  process.exit(1);
}
const forwarded = hasStarter ? args : ['--starter', starterRoot, ...args];
const result = spawnSync(process.execPath, [rendererCli, ...forwarded], {stdio: 'inherit'});
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
if (result.signal) {
  console.error(`starter-render terminated by signal ${result.signal}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
