#!/usr/bin/env node

import {h, mount} from 'ink';

import Cli from './cli';

mount(<Cli/>, process.stdout);