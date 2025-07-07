// import { Consumer, Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import pkg from 'kafkajs';
const { Consumer, Kafka, logLevel, Partitioners, Producer } = pkg


const CLIENT_ID = "hotel-service"
const GROUP_ID = 'hotel-service-group'
const BROKER = ['localhost:9092']

const kafka = new Kafka({
    clientId: CLIENT_ID,
    brokers: BROKER,
    loglevel: logLevel.info,
    retry: {
        retries: 5,
        initialRetryTime: 300,
    }
})

let producer = null;
let consumer = null;

// kafka.consumer({ groupId: 'hotel-service-group' })

const createTopic = async(topic) => {
    const topics = topic.map((t) => ({
        topic: t,
        numPartitions: 2,
        replicationFactor: 1
    }))

    const admin = kafka.admin()

    await admin.connect()

    const topicExists = await admin.listTopics()

    console.log('topicExists', topicExists)
    for (const t of topics) {
        if (!topicExists.includes(t.topic)) {
            await admin.createTopics({
                topics: [t]
            })
        }
    }

    await admin.disconnect()

}



export const connectProducer = async() => {
    await createTopic(["HotelEvents", 'BookingEvents'])

    if (producer) {
        console.log("producer already connected with existing connection")
        return producer
    }


    producer = kafka.producer({
        createPartitioner: Partitioners.DefaultPartitioner
    })

    await producer.connect()
    console.log('producer connected with a new connection')

    return producer
}


const disconnectProducer = async() => {
    if (producer) {
        await producer.disconnect()
    }
}



export const publish = async(data) => {
    // await connectProducer()
    const producer = await connectProducer();
    // const producer = await producer.connect()
    // console.log('xxx', data.message, data.topic, data.event, data.headers)
    const result = await producer.send({
        topic: data.topic,
        messages: [{
            headers: data.headers,
            key: data.event,
            value: JSON.stringify(data.message)
        }]
    })

    console.log('Publishing result', result)
    return result.length > 0
        // return 1
}


export const connectConsumer = async() => {
    if (consumer) {
        return consumer
    }

    consumer = kafka.consumer({
        groupId: GROUP_ID
    })

    await consumer.connect()
    return consumer
}


const disconnectConsumer = async() => {
    if (consumer) {
        await consumer.disconnect()
    }
}





export const subscribe = async(messageHandler, topic) => {
    const consumer = await connectConsumer();
    await consumer.subscribe({ topic: topic, fromBeginning: true })

    await consumer.run({
        eachMessage: async({ topic, partition, message }) => {
            // if (topic != "HotelEvents") {
            //     return
            // }

            if (message.key && message.value) {
                const inputMessage = {
                    headers: message.headers,
                    event: message.key.toString(),
                    data: message.value ? JSON.parse(message.value.toString()) : null
                }

                await messageHandler(inputMessage)
                await consumer.commitOffsets([
                    { topic, partition, offset: (Number(message.offset) + 1).toString() }
                ])
            }
        }
    })
}