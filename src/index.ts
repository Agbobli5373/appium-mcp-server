#!/usr/bin/env node

import { AppiumMCPServer } from './server/server.js';

const server = new AppiumMCPServer();
server.run().catch(console.error);
