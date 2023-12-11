import { exec } from 'node:child_process';
import { Client } from 'pg';
import { faker } from '@faker-js/faker';

require('dotenv').config();
const NodeEnvironment = require('jest-environment-node').TestEnvironment;

const prismaBinary = './node_modules/.bin/prisma';

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string;
  private connectionString: string;

  constructor(config: any) {
    super(config);
    const dbUser = process.env.TEST_DATABASE_USER;
    const dbPass = process.env.TEST_DATABASE_PASS;
    const dbHost = process.env.TEST_DATABASE_HOST;
    const dbPort = process.env.TEST_DATABASE_PORT;
    const dbName = process.env.TEST_DATABASE_NAME;
    this.schema = `test_schema_${faker.string.uuid()}`;
    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;
    exec(`${prismaBinary} migrate deploy`);
    return super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    });
    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();
  }
}
