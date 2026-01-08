// import { Consumer, Producer } from "kafkajs"
import pkg from 'kafkajs';
const { Consumer, Producer } = pkg
import { connectProducer, connectConsumer, publish, subscribe } from "../utils/message-broker.js"
import { HandleSubsrciption } from './paymentService.js'

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
    // await subscribe(HandleSubsrciption, "PaymentSuccessEvents")
}



//Publish Dedicated events based on use Cases
export const PaymentSuccess = async(data) => {
    // console.log(data)
    await publish({
        event: 'payment-completed',
        // topic: "HotelEvents",
        topic: "PaymentSuccessEvents",
        headers: {},
        message: data
    })
}


//Send order cancel events from hotel service
export const PaymentCancel = async(data) => {
    await publish({
        event: 'payment-cancel',
        topic: "PaymentCancelEvents",
        headers: {},
        message: data
    })
}