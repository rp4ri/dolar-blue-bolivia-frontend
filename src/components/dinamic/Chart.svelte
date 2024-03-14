<script lang="ts">
    import { onMount, onDestroy, tick } from 'svelte';
    import { writable, get } from 'svelte/store';
    import { fetchChartData } from '@utils/fetchChartData';
    import TemporalitySwitch from './TemporalitySwitch.svelte';

    let chartInstance;
    const prices = writable<number[]>([]);
    const labels = writable<string[]>([]);
    let canvasElement;

    const aspectRatio = window.innerWidth < 768 ? 1 : 2;
    let gradientStroke;
    let ctx;

    const isLoading = writable(true);

    let currentPrice = 0;
    let officialDollarGap = 0;

    function setupCanvas() {
        if (canvasElement) {
            ctx = canvasElement.getContext('2d');
            gradientStroke = ctx.createLinearGradient(0, 230, 30, 20);
            gradientStroke.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
            gradientStroke.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
            gradientStroke.addColorStop(0, 'rgba(94, 114, 228, 0)');

            // console.log('Canvas setup')
            const currentPrices = get(prices);
            const currentLabels = get(labels);
            updateChart(currentPrices, currentLabels);
        } else {
            console.error('El elemento canvas no está disponible.');
        }
    }

    function handleTemporalityChange(event) {
        const temporality = event.detail;
        loadChartData(temporality);
    }

    async function loadChartData(temporality) {
        try {
            const { prices: newPrices, labels: newLabels } = await fetchChartData(temporality);
            prices.set(newPrices);
            labels.set(newLabels);
            updateChart(newPrices, newLabels);
            if (temporality === 'hourly') {
                updateCurrentPrice(newPrices);
            }
        } catch (error) {
            console.error('Error al cargar los datos del gráfico:', error);
        } finally {
            isLoading.set(false);
        }
    }

    function updateCurrentPrice(newPrices) {
        currentPrice = newPrices[newPrices.length - 1];
        calculateOfficialDollarGap();
    }
    function calculateOfficialDollarGap() {
        const officialDollarPrice = 6.96;
        officialDollarGap = ((currentPrice - officialDollarPrice) / officialDollarPrice) * 100;
    }

    async function updateChart(newPrices, newLabels) {
        if (chartInstance) {
            chartInstance.data.labels = newLabels;
            chartInstance.data.datasets[0].data = newPrices;
            chartInstance.update();
        } else if (ctx) {
            const Chart = (await import('chart.js/auto')).default;

            chartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                    labels: newLabels,
                    datasets: [{
                        label: 'Precio',
                        tension: 0.4,
                        pointRadius: 0,
                        data: newPrices,
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
        }
    
    onMount(() => {
        loadChartData('hourly').then(() => {
            setupCanvas();
        });
    });

    onDestroy(() => {
        if (chartInstance) {
            chartInstance.destroy();
        }
    });
</script>

{#if $isLoading}
    <div class="loading-indicator relative h-100 center max-md:-mt-16" style="min-height: 450px;">🔥 espera...</div>
{:else}
    <div class="flex items-center justify-center max-md:-mt-16" style="min-height: 450px;">
        <canvas bind:this={canvasElement} style="width: 100%; height: 100%;"></canvas>
    </div>
{/if}

<div class="flex items-center justify-center max-md:-mt-10">
    <div class="font-bold [#FFF]/55 mr-4">Temporalidad:</div>
    <TemporalitySwitch on:change={handleTemporalityChange} />
</div>
<div class="flex items-center justify-center mt-4">
    <div class="font-bold text-[#FFF]/60 mx-4">Precio actual del dólar: <span class="text-[#FFF]/85">{currentPrice.toFixed(2)}</span></div>
    <div class="font-bold text-[#FFF]/60 mx-4">Brecha con el dólar oficial: <span class="text-[#FFF]/85">{officialDollarGap.toFixed(2)}%</span></div>
</div>

<style>
    .loading-indicator {
        /* height: 400px; */
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>