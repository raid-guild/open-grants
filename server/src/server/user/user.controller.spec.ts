import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';

const app = 'http://localhost:7001'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NzY4MTM5MzZ9.Ij3nxCtLY33KMvPLyNNSSxpyzfKJyUa9xH1BLvOIDQM';


describe('uploadProfile ', () => {
    it(`/POST`, () => {
        return request(app)
            .post('/api/v1/user/uploadProfile/5e07040a8a937d3cb0df9378')
            .attach('profile', __dirname + '/fixtures/fatcat.jpeg')
            .set('Accept', 'multipart/form-data')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
    });

});

describe('getAll ', () => {
    it(`/GET`, () => {
        return request(app)
            .get('/api/v1/user/getAll')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
    });

});

describe('get By id ', () => {
    it(`/GET`, () => {
        return request(app)
            .get('/api/v1/user/5e103c38cce43530fceebaf7')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
    });

});


describe('Search', () => {
    it('should Search user', () => {
        var user: { name: 'dev' }
        return request(app)
            .get('/api/v1/user/searchUser/search/dev')
            .send(user)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
    })
})

describe('update user', () => {
    it('should update user', () => {
        return request(app)
            .put('/api/v1/user')
            .send({
                "_id": "5e10365379f1b33d48ebdab0",
                "firstName": "test1",
                "lastName": "test1",
                "userName": "test2",
                "email": "test@gmail.com",
                "password": "12345"
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
    })
})

describe('delete user', () => {
    it('should delete user', () => {
        return request(app)
            .delete('/api/v1/user/5e10365379f1b33d48ebdab0')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
    })
})