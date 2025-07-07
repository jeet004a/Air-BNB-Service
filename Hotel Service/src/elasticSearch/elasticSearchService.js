import { Client } from '@elastic/elasticsearch'
import { config } from 'dotenv'
config()
const client = new Client({
    node: 'https://my-elasticsearch-project-a73761.es.us-east-1.aws.elastic.cloud:443',
    auth: {
        apiKey: process.env.ELASTIC_API_KEY
    },
    serverMode: 'serverless',
});



export default client