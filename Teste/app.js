const broker = "wss://broker.hivemq.com:8000/mqtt"; // Broker MQTT com WebSocket
const topic = "sensor/frequencia_card";

const client = mqtt.connect(broker);

let labels = [];
let dataPoints = [];

const ctx = document.getElementById("heartRateChart").getContext("2d");
const chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
            label: "Batimentos por Minuto (BPM)",
            data: dataPoints,
            borderColor: "red",
            borderWidth: 2,
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: "Tempo (s)" } },
            y: { title: { display: true, text: "BPM" }, min: 40, max: 180 }
        }
    }
});

client.on("connect", function() {
    console.log("Conectado ao MQTT");
    client.subscribe(topic);
});

client.on("message", function(topic, message) {
    const bpm = parseInt(message.toString());
    if (!isNaN(bpm)) {
        labels.push(new Date().toLocaleTimeString());
        dataPoints.push(bpm);

        if (labels.length > 20) { // Mantém apenas os últimos 20 pontos
            labels.shift();
            dataPoints.shift();
        }

        chart.update();
    }
});