import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { state } from './state';

describe('Comment controller', () => {
  let app: INestApplication;
  let logger = new Logger()
  let idPost = 44;
  let idFake = 999;
  let idComment: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("Post Comment", () => {
    it("Should be able return not found error", async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/post/${idFake}/comment`)
        .send({
          body: 'ini comment first'
        })
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe("Post is not found")
    })

    it("Should be able return error validation", async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/post/${idPost}/comment`)
        .send({
          body: ''
        })
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("Validation error")
    })

    it("Should be able return success and id value", async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/post/${idPost}/comment`)
        .send({
          body: 'Ini comment first'
        })
        .auth(state.token, { type: 'bearer' })

      idComment = response.body.data.id
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(typeof response.body.data.id).toBe('number');
    })
  })

  describe("Get Comment", () => {

    it("should be able return expected object value", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/post/${idPost}/comment`)
        .auth(state.token, { type: 'bearer' })        

      expect(response.status).toBe(200);
      expect(response.body.data.length >= 1).toBe(true);
      expect(response.body.pagging).toBeInstanceOf(Object);
      expect(typeof response.body.data[0].id).toBe('number')
      expect(typeof response.body.data[0].body).toBe('string')
      expect(typeof response.body.data[0].name).toBe('string')
      expect(typeof response.body.data[0].update_at).toBe('string')
      expect(typeof response.body.data[0].created_at).toBe('string')
    })

  })

  describe("Patch Comment", () => {
    it("Should be able return error validation", async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/post/${idFake}/comment/${idComment}`)
        .send({
          body: ''
        })
        .auth(state.token, { type: 'bearer' })


      expect(response.status).toBe(400)
      expect(response.body.message).toBe("Validation error")
    })

    it("Should be able return not found error", async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/post/${idFake}/comment/${idComment}`)
        .send({
          body: 'ini comment first'
        })
        .auth(state.token, { type: 'bearer' })


      expect(response.status).toBe(404)
      expect(response.body.message).toBe("Post is not found")
    })

    it("Should be able return success and id value", async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/post/${idPost}/comment/${idComment}`)
        .send({
          body: 'Ini comment first'
        })
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(typeof response.body.data.id).toBe('number');
    })
  })

  describe("Delete Comment", () => {

    it("Should be able return not found error", async () => {
      const response_1 = await request(app.getHttpServer())
        .delete(`/api/post/${idPost}/comment/${idFake}`)
        .auth(state.token, { type: 'bearer' })
      expect(response_1.status).toBe(404)
      expect(response_1.body.message).toBe("Comment is not found")

      const response_2 = await request(app.getHttpServer())
        .delete(`/api/post/${idFake}/comment/${idComment}`)
        .auth(state.token, { type: 'bearer' })

      expect(response_2.status).toBe(404)
      expect(response_2.body.message).toBe("Post is not found")
    })

    it("Should be able return success", async () => {

      const response = await request(app.getHttpServer())
        .delete(`/api/post/${idPost}/comment/${idComment}`)
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(typeof response.body.data.id).toBe('number')
    })
  })
});