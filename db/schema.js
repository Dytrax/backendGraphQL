const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`
type User {
    id:ID
    username: String
    email: String
    created:String
}

type Token {
    token:String
}

type File {
    uri: String!
    filename: String!
    mimetype: String!
    encoding: String!
}

type Product {
    id:ID
    name:String
    price:Float
    img:String
    createBy:ID
    created:String
}

input UserInput {
    username: String!
    email: String!
    password: String!
}

input AuthInput {
    email:String!
    password:String!
}

input ProductInput{
    name:String!
    price:Float!
    img:String!
    createBy:ID!
}

input ProductInputUpdate{
    name:String!
    price:Float!
    img:String!
}

input getProduct{
    createBy:String!
}

type Query {
    #User 
     getUser(token:String!):User
    #Upload image Product
     uploads: [File]
    #Products
    getProducts(input:String):[Product]
    getProduct(id:ID!):Product
 }


type Mutation {
    # User
    userNew (input : UserInput):User
    userAuth (input: AuthInput): Token
    refreshToken(token:String!):String

    # Upload Image
    uploadImgProduct(file: Upload!): File
    
    # Product
    productNew(input:ProductInput): Product
    productUpdate(id:ID!, input:ProductInputUpdate): Product
    productDelete(id:ID!): String

 }
`;

module.exports = typeDefs;