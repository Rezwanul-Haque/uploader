import * as request from 'supertest';
import { APP_URL } from '../utils/constants';

describe('File Upload (e2e)', () => {
  const app = APP_URL;

  it('Upload: /api/v1/files (POST)', () => {
    return request(app)
      .post('/api/v1/files')
      .from('file=@C:\\Users\\88017\\Downloads\\Games\\1597536211676.jpg')
      .send()
      .expect(201)
      .expect(({ body }) => {
        expect(body.publicKey).toBeDefined();
        expect(body.privateKey).toBeDefined();
      });
  });

  it('Get: /api/v1/files (GET)', () => {
    return request(app).post('/api/v1/auth/email/login').send().expect(200);
  });
});
