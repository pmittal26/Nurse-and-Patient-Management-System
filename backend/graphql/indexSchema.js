var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;


var {userquery, usermutation} = require("./userSchema");
var {alertquery, alertmutation} = require("./alertGraphQLSchema");
const { motivationalVideoQuery , motivationalVideoMutation} = require("./motivationalGraphQLSchema");
const {recordQuery, recordMutation} = require("./recordSchema");
const {infoQuery, infoMutation} = require("./infoGraphQLSchema");

const RootQuery  = new GraphQLObjectType({
    name: "RootQuery",
    fields: function () {
      return {
        ...userquery,
        ...alertquery,
        ...motivationalVideoQuery ,
        ...recordQuery,
        ...infoQuery
      };
    },
  });

const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: function () {
      return {
        ...usermutation,
        ...alertmutation,
        ...motivationalVideoMutation,
        ...recordMutation,
        ...infoMutation
      };
    },
  });

module.exports = new GraphQLSchema({ query: RootQuery, mutation: RootMutation });
