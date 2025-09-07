import cassandra from "cassandra-driver";
import fs from "fs/promises";
// @ts-ignore
import { SigV4AuthProvider } from "aws-sigv4-auth-cassandra-plugin";

const { AWS_REGION } = process.env;

const CASSANDRA_ENDPOINT = `cassandra.${AWS_REGION}.amazonaws.com`;

let dbClientCache: cassandra.Client | null = null;

export const getDbClient = async () => {
    if (dbClientCache) return dbClientCache;

    const cert = await fs.readFile("./server/db/sf-class2-root.crt", "utf-8");

    const sslOptions = {
        ca: [cert],
        rejectUnauthorized: true,
        host: CASSANDRA_ENDPOINT,
    };

    const authProvider = new SigV4AuthProvider();

    const client = new cassandra.Client({
        contactPoints: [CASSANDRA_ENDPOINT],
        localDataCenter: AWS_REGION,
        protocolOptions: { port: 9142 },
        sslOptions,
        authProvider,
        queryOptions: {
            consistency: cassandra.types.consistencies.localQuorum,
        },
    });

    await client.connect();

    dbClientCache = client;

    return client;
};
