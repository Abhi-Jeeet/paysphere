const {kafka} = require("kafkajs");
let kafkaProducer = null;

function createProducer(brokers, clientId){
    const kafka = new kafka({clientId, brokers: Array.isArray(brokers) ? brokers:[brokers]});
    const producer = kafka.producer();
    return producer;
}

async function initProducer(config){
    if(kafkaProducer) return kafkaProducer;
    const {KAFKA_BROKER, KAFKA_CLIENT_ID} = config;
    const producer = createProducer(KAFKA_BROKER, KAFKA_CLIENT_ID);
    await producer.connect();
    kafkaProducer = producer;
    return kafkaProducer;
}

async function publish(topic, messageObj){
    if(!kafkaProducer) throw new Error ("Producer not initialized");
    await kafkaProducer.send({
        topic,
        message:[
            {value: JSON.stringify(messageObj)}
        ]
    });
}


module.exports = {initProducer, publish};