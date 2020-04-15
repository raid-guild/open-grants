import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';

const app = 'http://localhost:7001'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTE5NjgxODZiYWVkYzMxNWM0MWE0ZmUiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwidXNlck5hbWUiOiJhZG1pbiIsImlhdCI6MTU3OTUyMTAzOX0.wmn65L3ohFEhPaI5u9Z2iH-khPm7JLW4-PGx8tmT29U';


describe('add grant', () => {
    it('should add grant', () => {
        return request(app)
            .post('/api/v1/grant')
            .send({
                "grantManager": "5dfb68605ad3812ac8ed0a28",
                "grantName": "test",
                "grantLink": "test",
                "grantAmount": "100",
                "type": "singleMilestone",
                "singleMilestone": {
                    "fundingExpiryDate": "2019-12-19T12:08:21.964Z",
                    "completionDate": "2019-12-19T12:08:21.964Z"
                },
                "amount": 100,
                "currency": "currency",
                "grantees": [
                    "5dfb68605ad3812ac8ed0a28"
                ],
                "createdBy": "5dfb68605ad3812ac8ed0a28"
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
    })
})


describe('getAll ', () => {
    it(`/GET`, () => {
        return request(app)
            .get('/api/v1/grant')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
    });

});

describe('get By id ', () => {
    it(`/GET`, () => {
        return request(app)
            .get('/api/v1/grant/get/5e12fee6f7f4c125f46d009e')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
    });

});

describe('createdByMe ', () => {
    it(`/GET`, () => {
        return request(app)
            .get('/api/v1/grant/createdByMe')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
    });

});


describe('managedByMe ', () => {
    it(`/GET`, () => {
        return request(app)
            .get('/api/v1/grant/managedByMe')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
    });

});

describe('fundedByMe ', () => {
    it(`/GET`, () => {
        return request(app)
            .get('/api/v1/grant/fundedByMe')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
    });

});

describe('update grant', () => {
    it('should update grant', () => {
        return request(app)
            .put('/api/v1/grant')
            .send({
                "type": "singleMilest",
                "grantManager": [],
                "grantees": [],
                "totalFund": 0,
                "currency": "currency",
                "isActive": true,
                "_id": "5e10687019a1d7363cde1f0c",
                "grantName": "test.",
                "grantLink": "test",
                "grantAmount": 100,
                "createdBy": null,
                "multipleMilestones": []
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
    })
})

describe('cancel grant', () => {
    it('should delete grant', () => {
        return request(app)
            .post('/api/v1/grant/cancel')
            .send({
                "grant": "5e2590913465a8055c8bf23b"
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
    })
})