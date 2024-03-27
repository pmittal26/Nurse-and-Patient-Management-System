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

var RecordModel = require('../models/Record');


// Create a graphql Object Type for User model
const RecordType = new GraphQLObjectType({
    name: 'Record',
    fields: () => ({
        patientId: { type: GraphQLString },
        nurseId: { type: GraphQLString },
        date: { type: GraphQLString },
        bodyTemperature: { type: GraphQLInt },
        bloodPressure: { type: GraphQLInt },
        heartRate: { type: GraphQLInt },
        respiratoryRate: { type: GraphQLInt }
    })
});

 // Create a query type for the record model
 const recordQuery = {
   
      records: {
        type: new GraphQLList(RecordType),
        resolve: async () => {
          try {
            const records = await RecordModel.find().exec();
            return records;
          } catch (err) {
            throw new Error('Error fetching records:', err);
          }
        }
      },
      recordsByPatientId: {
        type: new GraphQLList(RecordType),
        args: {
          patientId: {name: 'patientId', type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (root, args) => {
          try {
            const recordInfo = await RecordModel.find({ patientId: args.patientId }).exec();
            // if (!recordInfo || recordInfo.length === 0) {
            //   throw new Error(`Record with patient id ${args.patientId} not found`);
            // }
            if (!recordInfo) {
              const recordModel = new RecordModel(args.patientId);
              const newRecord = recordModel.save();
              if (!newRecord) {
                throw new Error('Error not new Record');
              }
              return newRecord
            }
            return recordInfo;
          } catch (err) {
            throw new Error(`Error fetching record with patient id ${args.patientId}:`, err);
          }
        }
      },
      record: {
        type: RecordType,
        args: {
          id: {name: '_id', type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (root, args) => {
          try {
            const recordInfo = await RecordModel.findById(args.id).exec();
            if (!recordInfo) {
              throw new Error(`Record with id ${args.id} not found`);
            }
            return recordInfo;
          } catch (err) {
            throw new Error(`Error fetching record with id ${args.id}:`, err);
          }
        }
      }
    
  };

  const recordMutation ={   
        addRecord: {
        type: RecordType,
        args: {
          patientId: {
            type: new GraphQLNonNull(GraphQLString)
          },
          nurseId: {
            type: new GraphQLNonNull(GraphQLString)
          },
          date: {
            type: new GraphQLNonNull(GraphQLString)
          },
          bodyTemperature: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          bloodPressure: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          heartRate: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          respiratoryRate: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          
        },
        resolve: function (root, params) {
          const recordModel = new RecordModel(params);
          const newRecord = recordModel.save();
          if (!newRecord) {
            throw new Error('Error not new Record');
          }
          return newRecord
        }
      },
      updateRecord: {
        type: RecordType,
        args: {
          id: {name: 'id', type: new GraphQLNonNull(GraphQLString) },
          patientId: { type: new GraphQLNonNull(GraphQLString) },
          nurseId: { type: new GraphQLNonNull(GraphQLString) },
          date: { type: new GraphQLNonNull(GraphQLString) },
          bodyTemperature: { type: new GraphQLNonNull(GraphQLInt) },
          bloodPressure: { type: new GraphQLNonNull(GraphQLInt) },
          heartRate: { type: new GraphQLNonNull(GraphQLInt) },
          respiratoryRate: { type: new GraphQLNonNull(GraphQLInt) }                          
        },
        resolve: async(parent, args) => {
          const updateRecord = await RecordModel.findByIdAndUpdate(args.id, args, { new: true });
          return updateRecord;
        }
      },
      deleteRecord: {
        type:RecordType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async(parent, args) => {
          await RecordModel.findByIdAndRemove(args.id);
          return "Record deleted successfully";
        }
      }
  };
    
    

module.exports = { recordQuery: recordQuery, recordMutation: recordMutation };
