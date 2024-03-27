// schemas.js
const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLDate
} = graphql;

var UserModel = require('../models/User');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "some_secret_key"; // generate this elsewhere
const jwtExpirySeconds = 3600;

// Create a graphql Object Type for User model
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLID},
        username: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        fullName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        userType: { type: GraphQLString }
    })
});

//Create a graphql Object Type for payload
const PayloadType = new GraphQLObjectType({
    name: 'Payload',
    fields: () => ({
        id: { type: GraphQLID},
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        userType: { type: GraphQLString },
        token: { type: GraphQLString },
        _id:{type: GraphQLString }
    })
});

const ClearCookieToken = (context) => {
    context.res.clearCookie('token');
};

const GetPayloadFromCookies = async (context) => {
    if (!context.req.cookies.token) {
        throw new Error('Error retrieving token from cookie');
    }
    var payload;
    try {
        payload = jwt.verify(context.req.cookies.token, JWT_SECRET);
    }
    catch (error){
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Json Web Token Error');
        }
        else
        {
            throw new Error('Error verifying token');
        }
    }
    return payload;
}

// create a GraphQL query type
const UserQuery = {
  
            users: {
                type: new GraphQLList(UserType),
                resolve: async () => {
                    const users = await UserModel.find({});
                    return users;
                }
            },
            user: {
                type: UserType,
                args: {
                    id: {
                        name: 'id',
                        type: GraphQLID
                    }
                },
                resolve: async (parent, args) => {
                    const user = await UserModel.findById(args.id);
                    if (!user){
                        throw new Error('Cannot find user');
                    }
                    return user;
                }
            },
            nurses:{
                type: new GraphQLList(UserType),
                resolve: async () => {
                    const nurses = await UserModel.find({userType: 'nurse'});
                    return nurses;
                }
            },
            patients:{
                type: new GraphQLList(UserType),
                resolve: async () => {
                    const patients = await UserModel.find({userType: 'patient'});
                    return patients;
                }
            },
            patient: {
                type: UserType,
                args: {
                    id: {
                        name: 'id',
                        type: GraphQLID
                    }
                },
                resolve: async (parent, args) => {
                    const patient = await UserModel.findById(args.id);
                    if (!patient){
                        throw new Error('Cannot find patient');
                    }
                    return patient;
                }
            },
            payload: {
                type: PayloadType,
                resolve: async (parent, args, context) => {
                    try {
                        return await GetPayloadFromCookies(context);
                    }
                    catch (error) {
                        throw new Error(error);
                    }
                }
            }
     
};

// create a GraphQL mutation type
const UserMutation  = {
            register: {
                type: UserType,
                args: {
                    username: { type: new GraphQLNonNull(GraphQLString) },
                    firstName: { type: new GraphQLNonNull(GraphQLString) },
                    lastName: { type: new GraphQLNonNull(GraphQLString) },
                    email: { type: new GraphQLNonNull(GraphQLString) },
                    password: { type: new GraphQLNonNull(GraphQLString) },
                    userType: { type: new GraphQLNonNull(GraphQLString) }
                },
                resolve: (parent, args) => {
                    const userModel = new UserModel(args);
                    const newUser = userModel.save();
                    if (!newUser) {
                        throw new Error('Error saving new user');
                    }
                    return newUser;
                }
            },
            login: {
                type: PayloadType,
                args: {
                    emailOrUsername: { type: new GraphQLNonNull(GraphQLString) },
                    password: { type: new GraphQLNonNull(GraphQLString) }
                },
                resolve: async (parent, args, context) => {
                    const userInfo = await UserModel.findOne({ $or:[ {email: args.emailOrUsername}, {username: args.emailOrUsername} ] }).exec()
                    if (!userInfo) {
                        throw new Error('Error finding user')
                    }
                    else {
                        console.log(userInfo.password)
                        // check if the password is correct
                        const isMatched = await bcrypt.compare(args.password, userInfo.password);
                        console.log(isMatched + ": |" + args.password + "| vs |" + userInfo.password + "|")
                        console.log(args.password == userInfo.password)
                        console.log(args.password === userInfo.password)

                        if (!isMatched) {
                            throw new Error('Incorrect password')
                        }
                        else {
                            // sign the given payload (arguments of sign method) into a JSON Web Token 
                            // and which expires 300 seconds after issue
                            const token = jwt.sign(
                                {
                                    id: userInfo._id,
                                    username: userInfo.username,
                                    email: userInfo.email,
                                    userType: userInfo.userType,
                                    _id: userInfo._id
                                },
                                JWT_SECRET,
                                { algorithm: 'HS256', expiresIn: jwtExpirySeconds }
                            );
                            console.log('registered token:', token)

                            // set the cookie as the token string, with a similar max age as the token
                            // here, the max age is in milliseconds
                            context.res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000, httpOnly: true });
                            const payload = {
                                id: userInfo._id,
                                username: userInfo.username,
                                email: userInfo.email,
                                userType: userInfo.userType,
                                token: token,
                                _id: userInfo._id
                            }
                            console.log(payload);
                            return payload;
                        }
                    }
                }
            },
            changeUserPassword: {
                type: GraphQLString,
                args: {
                    oldPassword: { type: new GraphQLNonNull(GraphQLString) },
                    newPassword: { type: new GraphQLNonNull(GraphQLString) }
                },
                resolve: async (parent, args, context) => {
                    if (args.oldPassword == args.newPassword) {
                        throw new Error('New password cannot be the same as old password')
                    }
                    else {
                        const payload = await GetPayloadFromCookies(context);
                        const userInfo = await UserModel.findById(payload._id).exec();
                        if (!userInfo) {
                            throw new Error('User not found')
                        }
                        else {
                            // check if the password is correct
                            const isMatched = await bcrypt.compare(args.oldPassword, userInfo.password);
                            console.log(isMatched + ": |" + args.oldPassword + "| vs |" + userInfo.password + "|")
                            if (isMatched) {
                                const newUserInfo = await UserModel.findByIdAndUpdate(userInfo._id, { password: args.newPassword }, { new: true }).exec();
                                if (!newUserInfo) {
                                    throw new Error('Cannot update password')
                                }
                                else {
                                    // Make sure the password saved is hashed
                                    newUserInfo.save();
                                    // clear cookie
                                    //ClearCookieToken(context);
                                    return newUserInfo.username;
                                }
                            }
                            else{
                                throw new Error('Incorrect password')
                            }
                        }
                    }
                }
            },
            deleteUser: {
                type: GraphQLString,
                args: {
                    username: { type: new GraphQLNonNull(GraphQLString) }
                },
                resolve: async (parent, args, context) => {
                    try {
                        const payload = await GetPayloadFromCookies(context);
                        if (payload.username == args.username
                            || payload.userType == 'nurse') {
                            const userInfo = await UserModel.findOne({ username: args.username }).exec();
                            if (!userInfo) {
                                throw new Error('User not found')
                            }
                            else {
                                if (payload.userType == 'nurse'
                                    && userInfo.userType == 'nurse'
                                    && userInfo.username != payload.username) {
                                    throw new Error('Unauthorized to delete other nurses')
                                }
                                else {
                                    const deletedUser = await UserModel.findByIdAndDelete(userInfo._id).exec();
                                    if (!deletedUser) {
                                        throw new Error('Cannot delete user')
                                    }
                                    else {
                                        if (userInfo.username == payload.username) {
                                            // clear cookie
                                            ClearCookieToken(context);
                                        }
                                        return deletedUser.username;
                                    }
                                }
                            }
                        }
                        else {
                            throw new Error('Unauthorized')
                        }
                    }
                    catch (error) {
                        throw new Error(error);
                    }
                }
            },
            logout: {
                type: GraphQLString,
                resolve: async (parent, args, context) => {
                    if (context.req.cookies.token !== undefined) {
                        try {
                            const payload = await GetPayloadFromCookies(context);
                            // clear cookie
                            ClearCookieToken(context);
                            return payload.username;
                        }
                        catch (error) {
                            throw new Error(error);
                        }
                    }
                    else{
                        return 'Already logged out'
                    }
                }
            }
        
    
};

module.exports = { userquery: UserQuery, usermutation: UserMutation};
