const { Kafka } = require("kafkajs");

let producer;

async function initKafka() {
    if (producer) return producer;

    const kafka = new Kafka({
        clientId: "product-service",
        brokers: [process.env.KAFKA_BROKER]  
    });

    producer = kafka.producer();
    await producer.connect();
    console.log("Kafka Producer connected");
    return producer;
}

async function publish(topic, message) {
    if (!producer) await initKafka();

    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
    });
}

module.exports = { initKafka, publish };
