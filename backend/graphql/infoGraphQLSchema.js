// schemas.js
const graphql = require('graphql');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLDate
} = graphql;

var InfoModel = require('../models/info.server.model');


// Create a graphql Object Type for User model
const InfoType = new GraphQLObjectType({
    name: 'Info',
    fields: () => ({
        patientId: { type: GraphQLString },
        date: { type: GraphQLString },
        pulseRate: { type: GraphQLInt },
        bloodPressure: { type: GraphQLInt },
        weight: {type: GraphQLInt},
        temperature: { type: GraphQLInt },
        respiratoryRate: { type: GraphQLInt }
    })
});

const infoQuery = {
   
  infos: {
    type:new GraphQLList(InfoType),
    resolve: async () => {
      try {
        const infos = await InfoModel.find().exec();
        return infos;
      } catch (err) {
        throw new Error('Error fetching records:', err);
      }
    }
  },
  infosByPatientId: {
    type: new GraphQLList(InfoType),
    args: {
      patientId: {name: 'patientId', type:new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (root, args) => {
      try {
        const info = await InfoModel.find({ patientId: args.patientId }).exec();
        // if (!recordInfo || recordInfo.length === 0) {
        //   throw new Error(`Record with patient id ${args.patientId} not found`);
        // }
        if (!info) {
          const infoModel = new InfoModel(args.patientId);
          const newInfo = infoModel.save();
          if (!newInfo) {
            throw new Error('Error not new Record');
          }
          return newInfo
        }
        return info;
      } catch (err) {
        throw new Error(`Error fetching record with patient id ${args.patientId}:`, err);
      }
    }
  },
  info: {
    type: InfoType,
    args: {
      id: {name: '_id', type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (root, args) => {
      try {
        const info = await InfoModel.findById(args.id).exec();
        if (!info) {
          throw new Error(`Record with id ${args.id} not found`);
        }
        return info;
      } catch (err) {
        throw new Error(`Error fetching record with id ${args.id}:`, err);
      }
    }
  }

};

const infoMutation ={   
        addInfo: {
        type: InfoType,
        args: {
          patientId: {
            type: new GraphQLNonNull(GraphQLString)
          },
          date: {
            type: new GraphQLNonNull(GraphQLString)
          },
          pulseRate: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          bloodPressure: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          weight: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          temperature: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          respiratoryRate: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          
        },
        resolve: function (root, params) {
          const infoModel = new InfoModel(params);
          const newInfo = infoModel.save();
          if (!newInfo) {
            throw new Error('Error not new Record');
          }
          return newInfo
        }
      }
  };
    
    

module.exports = { infoQuery: infoQuery, infoMutation: infoMutation };
