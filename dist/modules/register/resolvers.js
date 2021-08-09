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
exports.resolvers = void 0;
const bcrypt = require("bcrypt");
const User_1 = require("../../entity/User");
exports.resolvers = {
    Query: {
        bye: () => 'sup homes',
    },
    Mutation: {
        register: (_, { email, password }) => __awaiter(void 0, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt.hash(password, 10);
            const user = User_1.User.create({
                email,
                password: hashedPassword,
            });
            yield user.save();
            return true;
        }),
    },
};
//# sourceMappingURL=resolvers.js.map