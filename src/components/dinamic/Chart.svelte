<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { writable, get } from 'svelte/store';
    import { fetchChartData } from '@utils/fetchChartData';
    import TemporalitySwitch from './TemporalitySwitch.svelte';

    let chartInstance;
    const prices = writable<number[]>([]);
    const labels = writable<string[]>([]);
    let canvasElement;

    function handleTemporalityChange(event) {
        const temporality = event.detail;
        loadChartData(temporality);
    }

    async function loadChartData(temporality) {
        const { prices: newPrices, labels: newLabels } = await fetchChartData(temporality);
        prices.set(newPrices);
        labels.set(newLabels);
        updateChart();
    }

    async function updateChart() {
        if (chartInstance) {
            chartInstance.destroy();
        }

        const Chart = (await import('chart.js/auto')).default;
        const ctx = canvasElement.getContext('2d');
        const aspectRatio = window.innerWidth < 768 ? 1 : 2;
        const gradientStroke = ctx.createLinearGradient(0, 230, 30, 20);

        gradientStroke.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
        gradientStroke.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
        gradientStroke.addColorStop(0, 'rgba(94, 114, 228, 0)');

        chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                labels: get(labels),
                datasets: [{
                    label: 'Precio',
                    tension: 0.4,
                    pointRadius: 0,
                    data: get(prices),
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

        onMount(() => {
        loadChartData('hourly');
    });

    onDestroy(() => {
        if (chartInstance) {
            chartInstance.destroy();
        }
    });
</script>

<div class="relative h-100">
    <canvas bind:this={canvasElement}></canvas>
</div>
<div class="flex items-center justify-center">
    <div class="font-bold text-opacity-85 mr-4">Temporalidad:</div>
    <TemporalitySwitch on:change={handleTemporalityChange} />
</div>