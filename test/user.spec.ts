import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { state } from './state';

describe('User controller', () => {
  let app: INestApplication;
  let logger = new Logger()

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("LOGIN ", () => {

    it("should return body failed", async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: '',
          password: '',
        });

      logger.log(response.body)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.message).toBe("Validation error")
    })

    it('/auth/login POST', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'iqbal045',
          password: '25082005',
        });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(typeof response.body.data.token).toBe('string')
      state.token = response.body.data.token;
    })
  })

  describe('/api/user/me GET', () => {

    it('Should be able return obejct user info', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/user/me')
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(typeof response.body.data.username).toBe("string");
      expect(typeof response.body.data.id).toBe("number");
      expect(typeof response.body.data.name).toBe("string");
    });
  })

  it("Should be able return unathorized error", async () => {
    const response = await request(app.getHttpServer())
      .patch("/api/user")
      .send({
        name: "hisyanda"
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe("Unauthorized")

  })

  describe("PATCH user", () => {

    it("Should be able return validation error", async () => {
      const response = await request(app.getHttpServer())
        .patch("/api/user")
        .send({
          name: ""
        })
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.message).toBe("Validation error")
    })

    it("Should be able return id user value", async () => {
      const response = await request(app.getHttpServer())
        .patch("/api/user")
        .send({
          name: 'hisyanda'
        })
        .auth(state.token, { type: 'bearer' });

      expect(response.status).toBe(200)
      expect(typeof response.body.data.id).toBe("number")
    })
  })
});