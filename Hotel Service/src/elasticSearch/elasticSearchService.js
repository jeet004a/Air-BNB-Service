import { Client } from '@elastic/elasticsearch'
import { config } from 'dotenv'
config()
const client = new Client({
    node: 'https://my-elasticsearch-project-c14c42.es.us-central1.gcp.elastic.cloud:443',
    auth: {
        apiKey: process.env.ELASTIC_API_KEY
    },
    serverMode: 'serverless',
});



export default client