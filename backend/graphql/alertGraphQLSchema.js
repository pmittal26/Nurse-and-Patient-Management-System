var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLString = require("graphql").GraphQLString;
var GraphQLBoolean = require("graphql").GraphQLBoolean;
var AlertModel = require("../models/alert.server.model");
//
// Create a GraphQL Object Type for Course model
const patientType = new GraphQLObjectType({
  name: "patient",
  fields: function () {
    return {      
      fullName: { type: GraphQLString },      

    }
  }
});
const alertType = new GraphQLObjectType({
  name: "alert",
  fields: function () {
    return {
      _id: {
        type: GraphQLString,
      },
      patient: {
        type: patientType,
      },
      situation: {
        type: GraphQLString,
      },
      contactNumber: {
        type: GraphQLString,
      },
      created: {
        type: GraphQLString,
      },
      isAttended: {
        type: GraphQLBoolean,
      },

    };
  },
});

//
const alertquery = {
  
        alerts: {
          type: new GraphQLList(alertType),
          resolve: async () => {
            const alerts = await AlertModel.find().populate("patient").exec();
            console.log(alerts);
            if (!alerts) {
              throw new Error("Error");
            }
            return alerts;
          },
        },
      alert: {
        type: alertType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
        },
          resolve: async (root, params) => {
            const alertInfo = await AlertModel.findById(params.id).exec();
            if (!alertInfo) {
              throw new Error("Error");
            }
            return alertInfo;
          }
      }
  
};

const alertmutation = {

          addAlert: {
            type: alertType,
            args: {
              patient: {
                type: new GraphQLNonNull(GraphQLString),
              },
              situation: {
                type: new GraphQLNonNull(GraphQLString),
              },
              contactNumber: {
                type: new GraphQLNonNull(GraphQLString),
              },
            },
            resolve: async (root, params) => {
              const alertModel = new AlertModel(params);
              const newAlert = await alertModel.save();
              if (!newAlert) {
                throw new Error("Error");
              }
              return newAlert;
            },
          },
          updateAlert: {
            type: alertType,
            args: {
              id: {
                name: "id",
                type: new GraphQLNonNull(GraphQLString),
              },
              situation: {
                type: new GraphQLNonNull(GraphQLString),
              },
              contactNumber: {
                type: new GraphQLNonNull(GraphQLString),
              },
            },
            resolve: async (root, params) => {
              return await AlertModel.findByIdAndUpdate(
                params.id,
                {
                  situation: params.situation,
                  contactNumber: params.contactNumber,
                },
                function (err) {
                  if (err) return next(err);
                }
              );
            },
          },
          deleteAlert: {
            type: alertType,
            args: {
              id: {
                type: new GraphQLNonNull(GraphQLString),
              },
            },
            resolve: async (root, params) => {
              const deletedAlert = await AlertModel.findByIdAndRemove(params.id).exec();
              if (!deletedAlert) {
                throw new Error("Error");
              }
              return deletedAlert;
            },
          },
          attendAlert: {
            type: alertType,
            args: {
              id: {
                type: new GraphQLNonNull(GraphQLString),
              },
            },
            resolve: async (root, params) => {
              try{
                const attendedAlert = await AlertModel.findByIdAndUpdate(
                  params.id, { isAttended: true },{new : true}).exec();
                if (!attendedAlert) {
                  throw new Error("Error");
                }
                return attendedAlert;
              }catch(err){
                console.log(err);
              }

          },
        },
      
};

//
module.exports = { alertquery: alertquery, alertmutation: alertmutation };
