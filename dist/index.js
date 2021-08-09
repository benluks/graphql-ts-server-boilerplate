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
exports.startServer = void 0;
const express = require('express');
const apollo_server_express_1 = require("apollo-server-express");
const createTypeormConn_1 = require("./utils/createTypeormConn");
const fs = require("fs");
const path = require("path");
const schema_1 = require("@graphql-tools/schema");
const merge_1 = require("@graphql-tools/merge");
const load_1 = require("@graphql-tools/load");
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const schemas = [];
    const folders = fs.readdirSync(path.join(__dirname, './modules'));
    folders.forEach((folder) => __awaiter(void 0, void 0, void 0, function* () {
        const { resolvers } = require(`./modules/${folder}/resolvers`);
        const typeDefs = yield load_1.loadSchema('./modules/**/schema.graphql', {
            loaders: [new graphql_file_loader_1.GraphQLFileLoader()],
        });
        schemas.push(schema_1.makeExecutableSchema({ resolvers, typeDefs }));
    }));
    const app = express();
    const server = new apollo_server_express_1.ApolloServer({ schema: merge_1.mergeSchemas({ schemas }) });
    yield createTypeormConn_1.createTypeormConn();
    yield server.start();
    server.applyMiddleware({ app, path: '/graphql' });
    yield new Promise((resolve) => app.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    return app;
});
exports.startServer = startServer;
exports.startServer();
//# sourceMappingURL=index.js.map