const neo4j = require('neo4j-driver');
require('dotenv').config;

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

async function queryMovies() {
    const result = await session.run('MATCH (m:Movie) RETURN m LIMIT 10');
    return result.records.map(record => record.get('m').properties);
}

async function queryMovieById(id) {
    const result = await session.run('MATCH (m:Movie) WHERE m.id = $id RETURN m', {id});
    const movie = result.records[0]?.get('m');
    return movie ? movie.properties : null;
}

module.exports = {queryMovies, queryMovieById};