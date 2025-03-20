// Conexão com o HiveMQ (um broker MQTT público) e definição do tópico 
const broker = "wss://broker.hivemq.com:8000/mqtt"; 
const topic = "sensor/frequencia_card";

const client = mqtt.connect(broker);

let labels = [];
let dataPoints = [];

// Criando um gráfico em tempo real (Eixo X = tempo, Eixo Y = BPM)
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

// Conexão do cliente com o broker
client.on("connect", function() {
    console.log("Conectado ao MQTT");
    client.subscribe(topic);
});

// As mensagens chegam via MQTT e são convertidas em numeros inteiros
// Adiciona um novo ponto ao gráfico com a hora atual e o valor do BPM
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