import * as request from 'supertest';
import { server, setUpServer, tearDownServer } from './setup.e2e-spec';

describe('Person', () => {
  beforeAll(async () => {
    await setUpServer();
  });

  afterAll(async () => {
    await tearDownServer();
  });

  it('Registration', async () => {
    return request(server.getHttpServer())
      .post('api/register')
      .send({})
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.register.name).toBe('Test');
      });
  });
});
