import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';

const app = 'http://localhost:7001'

describe('signUp user', () => {
  it('should signUp user', () => {
    return request(app)
      .post('/api/v1/auth/signUp')
      .send({
        "firstName": "testcase",
        "lastName": "testuser",
        "userName": "testcase",
        "email": "testuser@gmail.com",
        "password": "12345"
      })
      .set('Accept', 'application/json')
      .expect(200);
  })
})


describe('Login user', () => {
  it('should login user', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        "userName": "devabc@gmail.com",
        "password": "12345"
      })
      .set('Accept', 'application/json')
      .expect(200);
  })
})