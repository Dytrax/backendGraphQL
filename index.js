const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');
require('dotenv').config({path:'variables.env'});
//conectarDB()
conectarDB();
//Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    
});

//arrancar el servidor
server.listen({port:process.env.PORT || 4000}).then(({url})=>{
    console.log(`Servidor listo en la ${url}`)
})