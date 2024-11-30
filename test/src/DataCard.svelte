<script>
    import * as d3 from 'd3';
    import Summary from './Summary.svelte';
    import Histogram from './Histogram.svelte';
    import Scatterplot from './Scatterplot.svelte';
    import BarChart from './BarChart.svelte';
    export let data;
    export let fullData;
    export let numCount;
    export let numArr;
    export let strArr;
    export let strCount;
    export let searchInput;
    export let searchOutput;

    
</script>

<main>
    <h4>Hollywood Movies Dataset (1996–2010)</h4>
    <div class="scroll-container">
       
        <!-- Summary Component -->
        <div class="summary-container">
            <Summary />
        </div>
        
        <div class="histograms-container">
            {#if !searchOutput}
            {#each Array(numCount) as _, i}
                <!-- {#each Array(numCount) as _, j}
                    {#if (i != j)} --> 
                        <div class="histogram-item">
                            <Histogram 
                                data={data} 
                                fullData={fullData} 
                                x={numArr[i]} 
                                searchOutput={searchOutput}
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
                                searchOutput={searchOutput}
                            />
                        </div>
                    {/if}
                {/each}
            {/each}
            {#each Array(strCount) as _, i}
                {#each Array(numCount) as _, j}
                    {#if Array.from(new Set(data.map(d => d[strArr[i]]))).length <= 25}
                        <div class="histogram-item"> 
                            
                            <BarChart
                                data={data} 
                                fullData={fullData} 
                                x={strArr[i]} 
                                y={numArr[j]} 
                                searchOutput={searchOutput}
                            />
                            
                        </div>
                    {/if}  
                {/each}
            {/each}
            {:else}
                {#if searchOutput["0"].attributes[0] && searchOutput["0"].types[0] === "Q"}
                        {#if searchOutput["0"].attributes[1]  && searchOutput["0"].types[0] === "Q"}
                            <div class="histogram-item">
                                <Scatterplot 
                                    data={data} 
                                    fullData={fullData} 
                                    x={searchOutput["0"].attributes[0]} 
                                    y={searchOutput["0"].attributes[1]} 
                                />
                            </div>
                        {:else if searchOutput["0"].attributes[1]  && (searchOutput["0"].types[0] === "O" || searchOutput["0"].types[0] === "N")}
                        <div class="histogram-item"> 
                            <BarChart
                                data={data} 
                                fullData={fullData} 
                                x={searchOutput["0"].attributes[0]} 
                                y={searchOutput["0"].attributes[1]} 
                            />
                        </div>
                        {/if}
                        
                {/if}
            {/if}
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

    h4 {
        text-align: left;
        padding-left: 8px;
    }
</style>
