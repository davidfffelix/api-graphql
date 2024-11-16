const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

async function runQuery(query, params = {}) {
    try {
        const result = await session.run(query, params);
        return result.records;
    } catch (error) {
        console.error('Erro ao executar a query:', error);
        throw error;
    }
}

async function queryMovies() {
    const query = 'MATCH (m:Movie)-[:ACTED_IN]->(p:Person) RETURN m, collect(p) as cast LIMIT 10';
    const records = await runQuery(query);

    return records.map(record => {
        const movie = record.get('m').properties;
        const cast = record.get('cast').map(person => person.properties);
        movie.cast = cast;
        return movie;
    });
}

async function queryMovieById(id) {
    const query = 'MATCH (m:Movie) WHERE m.id = $id RETURN m';
    const records = await runQuery(query, { id });

    const movie = records[0]?.get('m');
    return movie ? movie.properties : null;
}

async function queryPersons() {
    const query = 'MATCH (p:Person)-[:ACTED_IN]->(m:Movie) RETURN p, collect(m) as movies LIMIT 10';
    const records = await runQuery(query);

    return records.map(record => record.get('p').properties);
}

async function queryPersonById(id) {
    const query = 'MATCH (p:Person) WHERE p.id = $id RETURN p';
    const records = await runQuery(query, { id });

    const person = records[0]?.get('p');
    return person ? person.properties : null;
}

process.on('exit', () => {
    session.close();
});

module.exports = {queryMovies, queryMovieById, queryPersons, queryPersonById};
