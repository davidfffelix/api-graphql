const {gql, ApolloServer} = require('apollo-server');

const typeDefs = gql `
    type Movie {
        id: ID!
        released: Int
        tagline: String
        title: String
        cast: [Person]
    }

    type Person {
        id: ID!
        born: Int
        name: String
        movies: [Movie]
    }

    type Query {
        movies: [Movie]
        movie(id: ID!): Movie
        persons: [Person]
        person(id: ID!): Person
    }
`;
    
module.exports = {typeDefs};