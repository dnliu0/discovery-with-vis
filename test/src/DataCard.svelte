<script>
    import * as d3 from 'd3';
    import Summary from './Summary.svelte';
    import Histogram from './Histogram.svelte';
    import Scatterplot from './Scatterplot.svelte';
    import BarChart from './BarChart.svelte';
    import LineChart from './LineChart.svelte';
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
            {#each Array(strCount) as _, i}
                    {#if Array.from(new Set(data.map(d => d[strArr[i]]))).length <= 25}
                        <div class="histogram-item"> 
                            <BarChart
                                data={data} 
                                fullData={fullData} 
                                x={strArr[i]} 
                                y={''} 
                                searchOutput={searchOutput}
                            />
                            
                        </div>
                    {/if}  
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
            <!-- {#each Array(numCount) as _, i}
                {#each Array(numCount) as _, j}
                    {#if (i > j)}
                        <div class="histogram-item">
                            <LineChart 
                                data={data} 
                                fullData={fullData} 
                                x={numArr[i]} 
                                y={numArr[j]} 
                                searchOutput={searchOutput}
                            />
                        </div>
                    {/if}
                {/each}
            {/each} -->
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
                {#if searchOutput["0"].types.length === 1}
                    {#if searchOutput["0"].types[0] === "Q"}
                    <div class="histogram-item">
                        <Histogram 
                            data={data} 
                            fullData={fullData} 
                            x={searchOutput["0"].attributes[0]} 
                            searchOutput={searchOutput}
                        />
                    </div>
                    {:else}
                        {#if Array.from(new Set(data.map(d => d[searchOutput["0"].attributes[0]]))).length <= 25}
                        <div class="histogram-item"> 
                            <BarChart
                                data={data} 
                                fullData={fullData} 
                                x={searchOutput["0"].attributes[0]} 
                                y={''} 
                                searchOutput={searchOutput}
                            />
                        </div>
                        {/if}
                    {/if} 
                {:else if searchOutput["0"].types.length === 2}
                    {#if searchOutput["0"].types.filter(type => type === "Q").length === 2}
                    <div class="histogram-item">
                        <Scatterplot 
                            data={data} 
                            fullData={fullData} 
                            x={searchOutput["0"].attributes[0]} 
                            y={searchOutput["0"].attributes[1]} 
                        />
                    </div>
                    <!-- <div class="histogram-item">
                        <Scatterplot 
                            data={data} 
                            fullData={fullData} 
                            x={searchOutput["0"].attributes[1]} 
                            y={searchOutput["0"].attributes[0]} 
                        />
                    </div> -->
                    {:else}
                        <div class="histogram-item"> 
                            {#if Array.from(new Set(data.map(d => d[searchOutput["0"].attributes[searchOutput["0"].types.indexOf("Q") === 0 ? 1 : 0]]))).length <= 25}
                            <BarChart
                                data={data} 
                                fullData={fullData} 
                                x={searchOutput["0"].attributes[searchOutput["0"].types.indexOf("Q") === 0 ? 1 : 0]} 
                                y={searchOutput["0"].attributes[searchOutput["0"].types.indexOf("Q")]} 
                            />
                            {:else} 
                                <p>There are too many unique values in the selected {searchOutput["0"].types.indexOf("Q") === 0 ? 1 : 0} column to be visualized effectively. </p>
                            {/if}
                        </div>
                    {/if}
                {:else if searchOutput["0"].types.length > 2}
                <p>The system is currently limited to visualizing only two variables at a time.</p>
                {/if}
                <!-- {#if searchOutput["0"].attributes[0] && searchOutput["0"].types[0] === "Q"}
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
                        
                {/if} -->
            {/if}
        </div>
       
    </div>
    
</main>

<style>
    .scroll-container {
        display: flex;
        flex-direction: row;
        gap: 16px; 
        overflow-x: auto;
        padding: 10px;
        border: 1px solid #ccc;
    }

    .summary-container {
        flex-shrink: 0;
        width: 300px; 
        min-height: 120px; 
        padding: 10px;
        white-space: normal;
        box-sizing: border-box;
        border: 1px solid #ddd;
    }

    /* Container for histograms */
    .histograms-container {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap; 
        gap: 16px;
    }

    .histogram-item {
        flex-shrink: 0;
        width: 400px;
        height: 200px;
    }

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
