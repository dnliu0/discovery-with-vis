<script>
    import * as d3 from 'd3';
    import Summary from './Summary.svelte';
    import Heatmap from './Heatmap.svelte';
    import Histogram from './Histogram.svelte';
    import Scatterplot from './Scatterplot.svelte';
    export let data;
    export let fullData;
    export let numCount;
    export let numArr;
    export let strCount;
</script>

<main>
    <div class="scroll-container">
        <!-- Summary Component -->
        <div class="summary-container">
            <Summary />
        </div>

        <!-- Histograms -->
        <div class="histograms-container">
            {#each Array(numCount) as _, i}
                <!-- {#each Array(numCount) as _, j}
                    {#if (i != j)} -->
                        <div class="histogram-item">
                            <Histogram 
                                data={data} 
                                fullData={fullData} 
                                x={numArr[i]} 
                            />
                        </div>
                    <!-- {/if}
                {/each} -->
            {/each}
            {#each Array(numCount) as _, i}
                {#each Array(numCount) as _, j}
                    {#if (i > j)}
                        <div class="histogram-item">
                            <Scatterplot 
                                data={data} 
                                fullData={fullData} 
                                x={numArr[i]} 
                                y={numArr[j]} 
                            />
                        </div>
                    {/if}
                {/each}
            {/each}
        </div>
    </div>
</main>

<style>
    /* Main container for horizontal scrolling */
    .scroll-container {
        display: flex;
        flex-direction: row;
        gap: 16px; /* Spacing between items */
        overflow-x: auto;
        padding: 10px;
        border: 1px solid #ccc;
    }

    /* Styling for Summary container */
    .summary-container {
        flex-shrink: 0;
        width: 300px; 
        min-height: 120px; /* Ensure space for at least 6 lines of text */
        padding: 10px;
        white-space: normal;
        box-sizing: border-box; /* Include padding in total dimensions */
        border: 1px solid #ddd;
    }

    /* Container for histograms */
    .histograms-container {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap; /* Ensure all histograms stay in one row */
        gap: 16px;
    }

    /* Each histogram item */
    .histogram-item {
        flex-shrink: 0;
        width: 400px; /* Set a consistent width for each histogram */
        height: 200px; /* Adjust height as needed */
    }

    /* Optional styles for smoother scrolling */
    .scroll-container::-webkit-scrollbar {
        height: 8px;
    }

    .scroll-container::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 4px;
    }

    .scroll-container::-webkit-scrollbar-track {
        background-color: #f9f9f9;
    }
</style>
