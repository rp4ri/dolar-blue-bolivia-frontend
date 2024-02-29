<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    let canvasElement: HTMLCanvasElement; // Referencia al elemento canvas

    onMount(() => {
    if (canvasElement) {
        const ctx = canvasElement.getContext('2d');

        if (ctx) {
            var gradientStroke = ctx.createLinearGradient(0, 230, 30, 20);
            
            gradientStroke.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
            gradientStroke.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
            gradientStroke.addColorStop(0, 'rgba(94, 114, 228, 0)');
            
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [{
                    label: 'Precio',
                    tension: 0.4,
                    pointRadius: 0,
                    data: [12, 19, 13, 8, 12, 13],
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
                                color: '#ccc',
                                font: {
                                    size: 11,
                                    family: "Open Sans",
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
                                color: '#ccc',
                                padding: 20,
                                font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                                },
                            }
                        },
                    },
                    plugins: {
                        legend: {
                        display: false,
                        }
                    },
                }
            });
        }
    }
    });
</script>
  
<div class="relative h-100">
    <canvas bind:this={canvasElement}></canvas>
</div>