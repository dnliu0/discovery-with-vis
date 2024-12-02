<script>
    import * as d3 from 'd3';

    export let data;
    export let fullData;
    // export let filter;
    // export let update;
    export let x;
    export let y;
    export let searchOutput;

    let margin = {top: 10, right: 80, bottom: 75, left: 80};
    let width = 500;
    let height = 200;
    let chartW = width - margin.left - margin.right;
    let chartH = height - margin.top - margin.bottom;

    let brushLayer;
    let xAxis;
    let yAxis;
    let tooltip;
    const formatNumber = (value) => {
        if (value >= 1000) {
            return d3.format(".2s")(value);
        }
        return value;
    }

    function showTooltip(event, d) {
        console.log(d)
        event.target.style.fill = 'goldenrod';
        const [mouseX, mouseY] = d3.pointer(event);
        d3.select(tooltip).style("opacity", 1)
            .style("left", `${600+mouseX}px`)
            .style("top", `${150}px`)
            .html(`<strong>${x}:</strong> ${formatNumber(d.x)}<br/><strong>${y? y:'Count'}</strong> ${formatNumber(d.y)}`);
    }

    function hideTooltip(event) {
        d3.select(tooltip).style("opacity", 0);
        event.target.style.fill = 'grey';
    }
    

    let tempCriteria = ['Topic alignment',
                    'Comprehensive Coverage',
                    'Required Attribute',
                    'Data Ranges',
                    'Patterns',
                    'Granularity',
                    'Collection Timeframe',
                    'Update Frequency',
                    'Composition of Data Fields',
                    'Sample Data',
                    'Methods Used',
                    'Good Practices Adherence',
                    'Unusable Data',
                    'Completeness',
                    'Access to the Full Dataset',
                    'Suitable Format',
                    'High Quality Supplements',
                    'Data Provider Communication',
                    'Reputable Source',
                    'Recommendations',
                    'Popular Dataset',
                    'Methods Comply with Legal Requirements',
                    'Access Terms'];

    function makeData(data) {
        let barData = [];
        let uniqueX = Array.from(new Set(data.map(d => d[x])));
        uniqueX.forEach(i => {
            let count = 0;
            data.forEach(d => {
                if (d[x]==(i)) {
                    count += 1;
                }
            })
        barData.push({
                x: i,
                y: count
            }) ;
            count = 0;
        });
        return barData;
    }

    function makeData2(data) {
        let barData = [];
        let uniqueX = Array.from(new Set(data.map(d => d[x])));
        uniqueX.forEach(i => {
            let count = 0;
            data.forEach(d => {
                if (d[x]==(i)) {
                    count += d[y];
                }
            })
        barData.push({
                x: i,
                y: count
            }) ;
            count = 0;
        });
        return barData;
    }


    
    
    $: xScale = d3.scaleBand(Array.from(new Set(barData.map(d => d.x))), [0, chartW]);
    $: barData = y ? makeData2(fullData) : makeData(fullData);
    // $: partialBarData = makeData(data);
    // $: console.log(partialBarData)
    // d3.scaleLinear()
    //     .range([0, chartW])
    //     .domain([0, fullData.length]);
    // $: binData = d3.histogram()
    //     .value((d) => d['mentioned'])
    //     .domain(xScale.domain())
        // .thresholds(xScale.ticks(10));
    // $: backgroundBins = binData(fullData);
    // $: bins = binData(data);
    // $: yScale = d3.scaleLinear()
    //     .range([chartH, 0])
    //     .domain([0, d3.max(backgroundBins, (d) => d.length)]);

    $: yScale = d3.scaleLinear().range([chartH, 0]).domain([0, d3.max(y ? makeData2(fullData) : makeData(fullData), (d) => d.y)])
    // $: console.log(d3.max(makeData(fullData), (d) => d.y))
    $: {	
            // d3.select(brushLayer)
            //     .call(brush);
            if (searchOutput) {
                d3.selectAll("text").remove();
            }
            
            d3.select(xAxis)
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");
            d3.select(xAxis).append('text')
                    .text(x)
                    .style("font-size", "11px")
                    .style("font-weight", "bold")
                    .style("fill", "black")
                    .attr('x', (10 + chartW)/2)
                    .attr('y', 70);
            d3.select(yAxis)
                .call(d3.axisLeft(yScale).tickFormat(formatNumber))
                .append('text')
                .text(y ? y : 'Count')
                .style("font-size", "11px")
                .style("font-weight", "bold")
                .style("fill", "black")
                .attr('transform', 'rotate(-90)')
                .attr('x', -chartH/2 + 60)
                .attr('y', -38);
        }
    //$: console.log(fullData[0]['mentioned']);
  
</script>

<main>
    <svg {width} {height}>
        <g transform="translate({margin.left}, {margin.top})">
            {#each barData as d, i}
                <rect class = "backgroundbar"
                    x={xScale(d.x)+4} 
                    y={yScale(d.y)}
                    width={chartW/xScale.domain().length-8}
                    height={chartH - yScale(d.y)}
                    on:mouseover={(event) => showTooltip(event, d)}
                    on:mouseout={(event) => hideTooltip(event)}/>
            {/each}
            <!-- {console.log(partialBarData)} -->
            <!-- {#each partialBarData as d, i}
                <rect class = "bar"
                    x={7 + xScale(d.criterion)} 
                    y={yScale(d.count)}
                    width={24}
                    height={chartH - yScale(d.count)}/>
            {/each} -->
            <!-- {#each fullData as d, i}
                <rect class = "bar"
                    x={xScale(i)} 
                    y={yScale(d.count)}
                    width={xScale(i)-xScale(i-1)}
                    height={chartH - yScale(d.count)}/>
            {/each} -->
            
        </g>

        <g transform="translate({margin.left}, {margin.top})"
            bind:this={brushLayer} />
       
        <g transform="translate({margin.left}, {chartH + margin.top})" 
            bind:this={xAxis} />

        <g transform="translate({margin.left}, {margin.top})"
            bind:this={yAxis} />
      </svg>
      <div class="tooltip" bind:this={tooltip}></div>
</main>

<style>
    .bar {
        fill: goldenrod;
        opacity: 1;
        stroke: white;
        stroke-width: 1px;
    }

    .backgroundbar {
        fill: grey;
        opacity: 0.7;
    }

    .tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 5px;
        border-radius: 4px;
        pointer-events: none;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
    }


 </style>