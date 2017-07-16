#!/usr/bin/env node

import { h, render } from 'ink';
import { Command } from 'commander';

import Cli from './cli';

import packageJson from '../package.json';

new Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-name>', 'The name of the Project')
    .action(projectName => render(<Cli projectName={projectName} />, process.stdout))
    .parse(process.argv);
