const User = require('../models/User');
const Product = require('../models/Product');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid'); //import UUID/V4 to generate random UUIDs.
const s3 = require('../config/s3'); // import our configured S3 instance.
const { extname } = require('path');
require('dotenv').config({ path: 'variables.env' });

const createToken = (user, secret, expiresIn) => {
    const { id, email, username } = user;
    return jwt.sign({ id, email, username }, secret, { expiresIn })
}

const refreshToken = (token, secret) => {
    if (!token) {
        throw Error('Doesnt give a token')
    }
    return jwt.verify(token, secret, (error, decode) => {
        console.log('error' + error)
        //Receive token?
        if (!error) {
            return token;
        }
        //if expire Refresh token
        if (error.name == 'TokenExpiredError') {
            const { payload } = jwt.decode(token, { complete: true })
            //Info 
            if (!payload.id) {
                throw Error('Token doesnt match with the information')
            }
            console.log("Bien")
            const newToken = createToken(payload, secret, '1h')
            return newToken;
        } else {
            throw Error('Invalid Token')
        }
    });
}
//Resolvers
const resolvers = {
    Query: {
        getUser: async (_, { token }) => {
            const userId = await jwt.verify(token, process.env.SECRET);
            return userId
        },
        getProducts: async (_,{input})=>{
            try {
                const createdBy = input;
                console.log('input' +input)
                const productsResult = await Product.find({});
                
                const findByCreateBy = productsResult.filter(item=>{
                    console.log('item ' + item.createBy)
                    console.log('createdBy ' + createdBy)
                    return (item.createBy==createdBy);
                    /* console.log(createdBy) */
                })
                console.log(findByCreateBy)
                return findByCreateBy
            } catch (error) {
                console.log(error)
            }
            
            
        },
        getProduct: async (_, { id }) => {
            
            const product = await Product.findById(id);
            // Verify if Exist
            if(!product) {
                throw new Error('product doenst exist');
            }

            return product;
        },

    },
    Mutation: {
        userNew: async (_, { input }) => {
            const { email, password } = input;
            //User already exist
            const userExist = await User.findOne({ email })
            console.log(userExist)
            if (userExist) {
                throw new Error('The user is already register')
            }
            //Hash Password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);


            try {
                //Save in DB
                const user = new User(input);
                user.save(); //save
                return user;

            } catch (error) {
                console.log(error)
            }
        },
        userAuth: async (_, { input }) => {
            const { email, password } = input;
            //User Exist
            const userExist = await User.findOne({ email });
            if (!userExist) {
                throw new Error('User doesnt exist');
            }

            //Review password
            const passwordCorrect = await bcryptjs.compare(password, userExist.password)
            if (!passwordCorrect) {
                throw new Error('Password incorrect');
            }

            //Create Token
            return {
                token: createToken(userExist, process.env.SECRET, '30s')
            }
        },
        refreshToken: async (_, { token }) => {
            const refresh = await refreshToken(token, process.env.SECRET);
            console.log('refresh ' + refresh)
            return refresh
        },
        uploadImgProduct: async (_, { file }) => {
            //simply returning the file attributes
            const { createReadStream, filename, mimetype, encoding } = await file;
            
            const { Location } = await s3.upload({ // (C)
                Body: createReadStream(),               
                Key: `${uuid()}${extname(filename)}`,  
                ContentType: mimetype                   
              }).promise();                             
              console.log({
                createReadStream,
                filename,
                mimetype,
                encoding,
                uri: Location,
            })
              return {
                filename,
                mimetype,
                encoding,
                uri: Location, // (D)
              }; 
        },
        productNew: async (_,{input}) => {
            try {
                const product = new Product(input);

                //Save
                const result = await product.save();
                return result
            } catch (error) {
                console.log(error)
            }
        },
        productUpdate: async (_,{id,input}) =>{
        
            let product = await Product.findById(id);
            // Verify if Exist
            if(!product) {
                throw new Error('product doenst exist');
            }
            //Save
            product = await Product.findOneAndUpdate({_id:id},input,{new:true}) ;
            return product;
        },
        productDelete: async (_,{id})=>{
            let product = await Product.findById(id);
            // Verify if Exist
            if(!product) {
                throw new Error('product doenst exist');
            }
            await Product.findOneAndDelete({_id:id});
            return "Product delete"
        }
        
    }
}

module.exports = resolvers;

