import {
    SNSClient,
    CreateTopicCommand,
    SubscribeCommand,
    PublishCommand,
} from "@aws-sdk/client-sns";


export const snsClient = new SNSClient({
    region: "us-east-1", // replace with your region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY, // replace with your access key
        secretAccessKey: process.env.AWS_SECRET_KRY, // replace with your secret key
    },
});


export const sendEmailNotification = async(userEmail) => {
    try {
        const topicResponse = await snsClient.send(
            new CreateTopicCommand({ Name: process.env.TOPIC_NAME })
        );
        const topicArn = topicResponse.TopicArn;
        console.log("✅ Topic created:", topicArn);
        await snsClient.send(
            new SubscribeCommand({
                TopicArn: topicArn,
                Protocol: "email",
                Endpoint: userEmail //"wastijeet110@gmail.com",
            })
        );

        console.log("📨 Subscription request sent. Please confirm from your email:", userEmail);


        // const publishResponse = await snsClient.send(
        //     new PublishCommand({
        //         TopicArn: topicArn,
        //         Subject: "Thanks for sign up on Air BNB",
        //         Message: "You have successfully logged in!",
        //     })
        // );
        // console.log("📤 Message sent. Message ID:", publishResponse.MessageId);
    } catch (error) {
        console.log('Error from sns notification service', error)
    }
}



export const handleLoginNotificationService = async(email) => {

    // Step 1: Get topic ARN (assume already created)
    const topicResponse = await snsClient.send(
        new CreateTopicCommand({ Name: process.env.TOPIC_NAME })
    );
    const topicArn = topicResponse.TopicArn;
    // Step 3: Publish email notification
    const publishResponse = await snsClient.send(
        new PublishCommand({
            TopicArn: topicArn,
            Subject: "Thanks for sign up on Air BNB",
            Message: `Hello ${email}, you have just logged in at ${new Date().toLocaleString()}`,
        })
    );

    console.log('Login email sent. Message ID:', publishResponse.MessageId);
}