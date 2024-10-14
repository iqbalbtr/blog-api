import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { state } from './state';

describe('Post controller', () => {
  let app: INestApplication;
  let id: number;
  let fakeId = 9999;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("POST /api/post", () => {

    it("Should be able return error validaiton", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/post")
        .send({
          head: "",
          sub_head: "",
          body: ""
        })
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("Validation error")
    })

    it("should be able return id value", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/post")
        .send({
          head: "Header testing 1",
          sub_head: "Sub header 1",
          body: "Body post testing 1"
        })
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object);
      expect(typeof response.body.data.id).toBe("number")

      id = response.body.data.id;

      
    })
  })
  
  describe("GET post", () => {
    it("Should be able return object post list value", async () => {
      const response = await request(app.getHttpServer())
      .get("/api/post")
      .auth(state.token, { type: "bearer" })
      
      expect(response.body.data.length >= 1).toBe(true)
      expect(typeof response.body.data[0].id).toBe('number')
      expect(typeof response.body.data[0].head).toBe('string')
      expect(typeof response.body.data[0].sub_head).toBe('string')
      expect(typeof response.body.data[0].views).toBe('number')
      expect(typeof response.body.data[0].body).toBe("undefined")
      expect(typeof response.body.data[0].created_at).toBe("string")
      expect(typeof response.body.data[0].updated_at).toBe("string")
      expect(response.body.data[0].writer).toBeInstanceOf(Object)
      expect(typeof response.body.data[0].writer.id).toBe("number")
      expect(typeof response.body.data[0].writer.username).toBe("string")
      expect(typeof response.body.data[0].writer.name).toBe("string")
    })
  })

  describe(`Patch /api/post`, () => {

    const payload = {
      head: "Head edited",
      sub_head: "Sub head edited",
      body: "body edited"
    }
    
    it("Should be able return not found error", async () => {
      const response = await request(app.getHttpServer())
      .patch(`/api/post/${fakeId}`)
      .send(payload)
      .auth(state.token, { type: 'bearer' })
      
      expect(response.status).toBe(404)
      expect(response.body.message).toBe("Post is not found")
    })

    it("Should be able return bad request error", async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/post/${id}`)
        .send({
          head: ""
        })
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("Validation error")
    })

    // it("Should be able return Operation rejected error", async () => {
    //   const response = await request(app.getHttpServer())
    //     .delete(`/api/post/${id}`)
    //     .auth(state.token, { type: 'bearer' })

    //   expect(response.status).toBe(401)
    //   expect(response.body.message).toBe("Operation rejected")
    // })

    it("Should be able success and return id value", async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/post/${id}`)
        .send(payload)
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(200)
      expect(+response.body.data.id).toBe(id)
    })
  })

  describe('GET single post value', () => {
    it("Should be able return single post value", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/post/${id}`)
        .auth(state.token, { type: 'bearer' })

        expect(response.status).toBe(200)
        expect(typeof response.body.data.id).toBe('number')
        expect(typeof response.body.data.head).toBe('string')
        expect(typeof response.body.data.sub_head).toBe('string')
        expect(typeof response.body.data.views).toBe('number')
        expect(typeof response.body.data.body).toBe("string")
        expect(typeof response.body.data.created_at).toBe("string")
        expect(typeof response.body.data.updated_at).toBe("string")
        expect(response.body.data.writer).toBeInstanceOf(Object)
        expect(typeof response.body.data.writer.id).toBe("number")
        expect(typeof response.body.data.writer.username).toBe("string")
        expect(typeof response.body.data.writer.name).toBe("string")
    })
  })

  describe(`Delete /api/post/${id}`, () => {

    it("Should be able return not found error", async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/post/${fakeId}`)
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe("Post is not found")
    })

    // it("Should be able return Operation rejected error", async () => {
    //   const response = await request(app.getHttpServer())
    //     .delete(`/api/post/${id}`)
    //     .auth(state.token, { type: 'bearer' })

    //   expect(response.status).toBe(401)
    //   expect(response.body.message).toBe("Operation rejected")
    // })

    it("Should be able success and return id value", async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/post/${id}`)
        .auth(state.token, { type: 'bearer' })

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object);
      expect(typeof response.body.data.id).toBe("number")
    })
  })
});