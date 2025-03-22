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
            borderColor: "#007700", // Verde escuro para a linha
            borderWidth: 3,
            fill: false,
            tension: 0.2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: { display: true, text: "Tempo", color: "#00ff00" },
                ticks: { 
                    color: "#00ff00",
                    font: { size: 18 }, // Aumentando o tamanho da fonte
                    callback: function(value, index, values) {
                        return index % 3 === 0 ? labels[index] : ""; // Exibe a cada 3 segundos
                    }
                },
                grid: {
                    color: "#00ff00",
                    lineWidth: 0.5
                }
            },
            y: {
                title: { display: true, text: "BPM", color: "#00ff00" },
                ticks: { 
                    color: "#00ff00",
                    font: { size: 14 },
                    stepSize: 20,
                    min: 40, 
                    max: 180
                },
                grid: {
                    color: "#00ff00",
                    lineWidth: 0.5
                }
            }
        },
        plugins: {
            legend: { labels: { color: "#00ff00", font: { size: 14 } } }
        }
    }
});

// Função para obter a hora real no formato HH:MM:SS
function getRealTime() {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { hour12: false });
}

// Simulação de dados em tempo real
function addData() {
    const bpm = Math.floor(Math.random() * (120 - 60) + 60); // Simulando BPM entre 60 e 120
    labels.push(getRealTime()); // Adiciona a hora real

    dataPoints.push(bpm);

    if (labels.length > 20) { // Mantém apenas os últimos 20 pontos
        labels.shift();
        dataPoints.shift();
    }

    chart.update();
}

setInterval(addData, 1000); // Adiciona um novo ponto a cada segundo