<script lang="ts">
    import { onMount } from 'svelte';
    // import Chart from 'chart.js/auto';

    import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
    import { db } from '@utils/firebaseConfig';

    export let prices: number[] = [];
    export let labels: string[] = [];

    let canvasElement: HTMLCanvasElement;

    async function loadChartJS() {
        const module = await import('chart.js/auto');
        return module.default;
    }

    onMount(async () => {
        const ChartJS = await loadChartJS();

        const aspectRatio = window.innerWidth < 768 ? 1 : 2;
        const ctx = canvasElement.getContext('2d');

        if (ctx) {
            var gradientStroke = ctx.createLinearGradient(0, 230, 30, 20);
            // var gradientStroke = ctx.createLinearGradient(200, 330, 100, 20);
            
            gradientStroke.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
            gradientStroke.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
            gradientStroke.addColorStop(0, 'rgba(94, 114, 228, 0)');
            
            new ChartJS(ctx, {
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
                    aspectRatio: aspectRatio,
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