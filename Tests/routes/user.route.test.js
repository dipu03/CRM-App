const User = require('../../models/user.model');
const app = require('../../server');
const request = require('supertest');
const db = require('../db');
const serverConfig = require('../../configs/server.config');
const jwt = require('jsonwebtoken');

let token ;
beforeAll( async () => {
    token = jwt.sign({id : "test01"}, serverConfig.SECRET_KEY, {expiresIn:500});

    await db.clearDatabase()

    await User.create({
        name : "test",
        userId : "test01",
        email : "test@gmail.com",
        password : "testpass",
        userType : "ADMIN",
        userStatus : "APPROVED"
    })
})

afterAll( async () => {
    await db.closeDatabase()
})

describe("integration test for findAllUser route", () => {

    it("test findAllUser route", async () => {

        const res = await request(app).get('/crm/api/v1/users').set("x-access-token", token)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name : "test",
                    userId : "test01",
                    email : "test@gmail.com",
                    userType : "ADMIN",
                    userStatus : "APPROVED"
                })
            ])
        )
    })

    it("Find user based on userId", async () => {

        const res = await request(app).get('/crm/api/v1/users/test01').set("x-access-token", token)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name : "test",
                    userId : "test01",
                    email : "test@gmail.com",
                    userType : "ADMIN",
                    userStatus : "APPROVED"
                })
            ])
        )
    })

})
