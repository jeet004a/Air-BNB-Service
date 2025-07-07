// import { Consumer, Producer } from "kafkajs"
import pkg from 'kafkajs';
const { Consumer, Producer } = pkg
import { connectProducer, connectConsumer, subscribe, publish } from "../utils/broker/message-broker.js"
import { HandleSubsrciption } from './bookingService.js'

export const InitiallizeBroker = async() => {

    //Initialize the  broker and consumer
    const producer = await connectProducer()
    producer.on('producer.connect', () => {
        console.log("Order service Producer connected sucessfully")
    })


    const consumer = await connectConsumer()

    consumer.on("consumer.connect", () => {
        console.log("Order Service Consumer connected sucessfully")
    })


    //Keep listining the consumer events 
    //Perform the action based on events
    // await subscribe(HandleSubsrciption, "HotelEvents")
    await subscribe(HandleSubsrciption, "BookingEvents")
}



//Publish Dedicated events based on use Cases
export const SendCreateOrderMessage = async() => {
    await publish({
        event: 'create-order',
        topic: "HotelEvents",
        headers: {},
        message: data
    })
}


//Send order cancel events from hotel service
export const SendOrderCancel = async() => {
    await publish({
        event: 'cancel-order',
        topic: "HotelEvents",
        headers: {},
        message: data
    })
}