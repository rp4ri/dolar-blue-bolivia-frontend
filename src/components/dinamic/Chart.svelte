<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';

    import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
    import { db } from '@utils/firebaseConfig';

    let canvasElement: HTMLCanvasElement;
    let prices: number[] = [];
    let labels: string[] = [];

    onMount(async () => {
        const q = query(collection(db, import.meta.env.PUBLIC_FIRESTORE_BINANCE_COLLECTION), orderBy("timestamp", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        let data: number[] = [];
        let timestamps: string[] = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data().averagePrice);
            const timestampDate = doc.data().timestamp.toDate();
            timestamps.push(timestampDate.toLocaleTimeString('es-ES', { hour: '2-digit'}));

        });

        prices = data.reverse();
        labels = timestamps.reverse();

        const ctx = canvasElement.getContext('2d');

        if (ctx) {
            var gradientStroke = ctx.createLinearGradient(0, 230, 30, 20);
            // var gradientStroke = ctx.createLinearGradient(200, 330, 100, 20);
            
            gradientStroke.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
            gradientStroke.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
            gradientStroke.addColorStop(0, 'rgba(94, 114, 228, 0)');
            
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                labels: labels,
                datasets: [{
                    label: 'Precio',
                    tension: 0.4,
                    pointRadius: 0,
                    data: prices,
                    backgroundColor: gradientStroke,
                    borderColor: "#5e72e4",
                    borderWidth: 3,
                    fill: true,
                }]
                },
                options: {
                    responsive: true,
                    aspectRatio: 2,
                    // maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    scales: {
                        y: {
                            // beginAtZero: true
                            grid: {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: false,
                            },
                            ticks: {
                                display: true,
                                padding: 10,
                                color: '#949BA8',
                                font: {
                                    size: 15,
                                    // family: "Open Sans",
                                    style: 'normal',
                                    lineHeight: 2
                                },
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false,
                            },
                            ticks: {
                                display: true,
                                color: '#949BA8',
                                padding: 20,
                                font: {
                                size: 15,
                                // family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                                },
                            }
                        },
                    },
                    plugins: {
                        legend: {
                        display: false,
                        },
                    },
                }
            });
        }
    });
</script>
  
<div class="relative h-100">
    <canvas bind:this={canvasElement}></canvas>
</div>