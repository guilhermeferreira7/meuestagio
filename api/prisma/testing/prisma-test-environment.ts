import { execSync } from 'node:child_process';
import NodeEnvironment from 'jest-environment-node';
import { faker } from '@faker-js/faker';
import { prisma } from '../prisma';
require('dotenv').config();

const prismaBinary = './node_modules/.bin/prisma';

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string;
  private connectionString: string;

  constructor(config: any, context: any) {
    super(config, context);

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

    execSync(`${prismaBinary} migrate deploy`);

    return super.setup();
  }

  async teardown() {
    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`,
    );

    // const connections =
    //   await prisma.$executeRaw`SELECT * FROM pg_stat_activity`;
    // console.log('connections', connections);

    // close connections in 'idle' to avoid 'too many clients already'
    await prisma.$executeRaw`
      SELECT
        pg_terminate_backend ( pg_stat_activity.pid )
      FROM
        pg_stat_activity
      WHERE
        pg_stat_activity.state = 'idle'
    `;

    await prisma.$disconnect();
  }
}
