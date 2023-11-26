import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export function post(
  path: string,
  app: INestApplication,
  token?: string,
  body?: any,
): request.Test {
  return request(app.getHttpServer())
    .post(path)
    .set('Authorization', `Bearer ${token}`)
    .send(body);
}

export function patch(
  path: string,
  app: INestApplication,
  token?: string,
  body?: any,
): request.Test {
  return request(app.getHttpServer())
    .patch(path)
    .set('Authorization', `Bearer ${token}`)
    .send(body);
}

export function get(
  path: string,
  app: INestApplication,
  token?: string,
  query?: any,
): request.Test {
  return request(app.getHttpServer())
    .get(path)
    .query(query)
    .set('Authorization', `Bearer ${token}`);
}
