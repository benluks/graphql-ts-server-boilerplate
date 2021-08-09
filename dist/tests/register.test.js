"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const createTypeormConn_1 = require("../utils/createTypeormConn");
const graphql_request_1 = require("graphql-request");
const constants_1 = require("./constants");
const User_1 = require("../entity/User");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield createTypeormConn_1.createTypeormConn();
}));
const email = 'test@test.com';
const password = 'testtesttest';
const mutation = `
mutation {
    register(email: "${email}", password: "${password}")
}`;
test('Register user', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield graphql_request_1.request(constants_1.host, mutation);
    expect(response).toEqual({ register: true });
    const users = yield User_1.User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
}));
//# sourceMappingURL=register.test.js.map