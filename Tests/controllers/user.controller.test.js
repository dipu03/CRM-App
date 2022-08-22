
const {findAllUser} = require('../../controllers/user.controller');
const {findByUserId} = require('../../controllers/user.controller');
const {update} = require('../../controllers/user.controller');
const User = require('../../models/user.model');

const {mockRequest, mockResponse} = require('../interceptor');

const userPayload = {
    name : "Test",
    userId : "test01",
    email : "test@gmail.com",
    userType : "CUSTOMER",
    userStatus : "APPROVED",
    ticketsAssigned : [],
    ticketsCreated : []
}



describe("test findAll method", () => {

    it("test findAlllUsers with empty query", async () => {

        const userSpy = jest.spyOn(User, "find").mockReturnValue(Promise.resolve([userPayload]));

        const req = mockRequest();
        const res = mockResponse();

        const query = {};

        await findAllUser(req, res)

        // Assertion

        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    name : "Test"
                })
            ])
        )
    });

    it("test findAllUser method with valid query", async () => {

        const userSpy = jest.spyOn(User, "find").mockReturnValue(Promise.resolve([userPayload]));

        const req = mockRequest();
        const res = mockResponse();

        req.query = {userStatus : "APPROVED"}

        await findAllUser(req, res);

        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    userStatus : "APPROVED"

                })
            ])
        )
    });

    it("test findAllUser with exception", async () => {

        const userSpy = jest.spyOn(User, "find").mockReturnValue(Promise.reject(new Error("err")))

        const req = mockRequest();
        const res = mockResponse();

        req.query = {}

        await findAllUser(req, res)

        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({
            message : "Internal Server Error !!!"
        })
        
    })
})

describe("test findByUserId method", () => {

    it("test findByUserId for good case", async () => {

        const userSpy = jest.spyOn(User, "find").mockReturnValue(Promise.resolve([userPayload]))

        const req = mockRequest();
        const res = mockResponse();

        req.param = {userId : "test01"}

        await findByUserId(req, res)

        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    name : "Test"

                })
            ])
        )

    });

    it("test exception", async() => {

        const userSpy = jest.spyOn(User, "find").mockReturnValue(Promise.reject(new Error("err")))

        const req = mockRequest();
        const res = mockResponse();

        req.query = {}

        await findByUserId(req, res)

        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({
            message : "Internal Server Error"
        })
    })
})

// const userPayloadUpdated = {
//     name : "TestUpdated",
//     userId : "test01",
//     email : "test@gmail.com",
//     userType : "CUSTOMER",
//     userStatus : "APPROVED",
//     ticketsAssigned : [],
//     ticketsCreated : []
// }

// describe("test update method", () => {

//     it("test update method for good case", async () => {

//         const userSpy = jest.spyOn(User, "findOne").mockReturnValue(Promise.resolve({userPayload}))

        
//         const req = mockRequest();
//         const res = mockResponse();
        
//         // const userSpyUpdate = jest.spyOn(userPayload, "save").mockReturnValue(Promise.resolve({userPayloadUpdated}))

//         req.params = {userId : "test01"}

//         await update(req, res);

//         expect(userSpy).toHaveBeenCalled();
//         // done()

//     })
// })

