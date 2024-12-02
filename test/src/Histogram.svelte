<script>
    import * as d3 from 'd3';

    export let data;
    export let fullData;
    
    // export let filter;
    // export let update;
    export let x;
    export let searchOutput;

    let margin = {top: 30, right: 100, bottom: 30, left: 70};
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


    // const brush = d3.brushX()
    //     .extent([[0, 0], [chartW, chartH]])
    //     .on("brush", brushed)
    //     .on("end", brushended);        

    // function brushed(event) {
        
    //     if (event && event.selection) {
            
    //         filter = [xScale.invert(event.selection[0]), xScale.invert(event.selection[1])];
    //         //console.log(filter);
    //         update();
    //     }
    // }

    // function brushended(event) {
    //     if (event && !event.selection) {
    //         filter = [];
    //         update();
    //     }
       
    // }
    function showTooltip(event, d) {
        console.log("y")
        event.target.style.fill = 'goldenrod';
        const [mouseX, mouseY] = d3.pointer(event);
        d3.select(tooltip).style("opacity", 1)
            .style("left", `${600+mouseX}px`)
            .style("top", `${150}px`)
            .html(`<strong>${x}:</strong> ${formatNumber(d.x0)} - ${formatNumber(d.x1)}<br/><strong>${'Count'}</strong> ${d.length}`);
    }

    function hideTooltip(event) {
        d3.select(tooltip).style("opacity", 0);
        event.target.style.fill = 'grey';
    }
    
    
    $: xScale = d3.scaleLinear()
        .range([0, chartW])
        .domain([0, d3.max(fullData, (d) => d[x])]);
    $: binData = d3.histogram()
        .value((d) => d[x])
        .domain(xScale.domain())
        .thresholds(xScale.ticks(10));
    $: backgroundBins = binData(fullData);
    // $: bins = binData(data);
    $: yScale = d3.scaleLinear()
        .range([chartH, 0])
        .domain([0, d3.max(backgroundBins, (d) => d.length)]);
        
    $: {	
            // d3.select(brushLayer)
            //     .call(brush);
            if (searchOutput) {
                d3.selectAll("text").remove();
            }
            d3.select(xAxis)
            .call(d3.axisBottom(xScale)
                    .ticks(10)
                    .tickFormat(formatNumber))
                    .append('text')
                .text(x)
                .style("font-size", "11px")
                .style("font-weight", "bold")
                .style("fill", "black")
                .attr('x', (10 + chartW)/2)
                .attr('y', 30);
            d3.select(yAxis)
                .call(d3.axisLeft(yScale))
                .append('text')
                .text('Count')
                .style("font-size", "11px")
                .style("font-weight", "bold")
                .style("fill", "black")
                .attr('transform', 'rotate(-90)')
                .attr('x', -chartH/2 + 20)
                .attr('y', -38);
                
        }
</script>

<main>
    <svg {width} {height}>
        <g transform="translate({margin.left}, {margin.top})">
            <!-- {#each fullData as d, i}
                <circle class = "bar"
                    cx={xScale(i)} 
                    cy={yScale(d.count)}
                    r="6"/>
            {/each}
            {#each fullData as d, i}
                <circle class = "backgroundbar"
                    cx={xScale(i)} 
                    cy={yScale(d.count)}
                    r="6"/>
            {/each} -->
            {#each backgroundBins as d, i}
                <rect class = "backgroundbar"
                x={xScale(d.x0)} 
                y={yScale(d.length)}
                width={xScale(d.x1) - xScale(d.x0)}
                height={chartH - yScale(d.length)}
                on:mouseover={(event) => showTooltip(event, d)}
                on:mouseout={(event) => hideTooltip(event)}/>
            {/each}
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
        opacity: 0.7;
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