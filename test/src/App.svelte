<script>
  import * as d3 from 'd3';
	import {onMount} from 'svelte';
  
  import Map from './Map.svelte';
  import Histogram from './Histogram.svelte';
  import Heatmap from './Heatmap.svelte';
  import Scatterplot from './Scatterplot.svelte';
  import Histogram2 from './Histogram2.svelte';
  import BarChart from './BarChart.svelte';
  import Parallel from './Parallel.svelte';
  import Search from './Search.svelte';
  import DataCard from './DataCard.svelte';

	let data = [];
  let fullData = [];
  let filter1 = [];
  let filter2 = [];
  let count = 0;
  let numCount = 0;
  let strCount = 0;
  let numArr = [];
  let strArr = [];
  
  let cuisine_list = ['American',
                      'Chinese',
                      'Pizza',
                      'Coffee/Tea',
                      'Mexican',
                      'Latin American',
                      'Bakery Products/Desserts',
                      'Japanese',
                      'Italian',
                      'Caribbean']
  // let var1 = "percentWhite";
  let var1 = "diversity";
  let var3 = 'max_cuisine';
  let var2 = 'count';
  let new_cuisine_list;
  let criteria = [];
  let uniqueAspects = ['Data Meet Purpose', 'Data Quality Check', 'Pay Access Decision'];
  let uniqueInfoUsed = ['Topic alignment',
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
  // ['Source reputation', 'User reviews', 'Metadata', 'Data collection conditions', 'Prevalence of missing data', 'Ability to access full datasets', 'Sample Data', 'Visualizations'];
  

	onMount(async function() {    
    //load data from 
    let table = d3.csv('https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv', (d) => ({
          ...d,
          'IMDB Rating': + d['IMDB Rating'],
        }));

    
    await Promise.all([table]).then((values) => {
      console.log(values);
      let table = values[0];
      console.log(table)
      let cols = [];
      for (let i = 0; i < 68; i++) {
        data.push({});
        data[i]['idx'] = i;
        Object.keys(table[0]).forEach(o => {
          if (o) {
            data[i][o] = table[i][o];
            if (+data[i][o]) {
              data[i][o] = +data[i][o];
            }
            count += 1;
          }
        });
        // data[i]['count'] = count;
        // data[i]['numCount'] = numCount;
        // data[i]['strCount'] = count - numCount;
        // data[i]['numArr'] = numArr;
        // data[i]['strArr'] = strArr;
      }
      Object.keys(table[0]).forEach(o => {
        if (+table[0][o]) {
          numCount += 1;
          numArr.push(o);
        } else {
          strCount += 1;
          strArr.push(o);
        }
      })
      console.log(data);
      fullData = [...data];
    });
	});


  function updateData(){
    //[filter1[0], filter1[1]]
    let subInfo = uniqueInfoUsed.slice(filter1[0], filter1[1]);
    // console.log(subInfo)
    if (filter1.length > 0 && filter2.length > 0) {
      data = fullData.filter((d) => {
        d['mentioned'].forEach((m) => {
          return (subInfo.includes(m));
        })
      });
    } else if (filter1.length > 0 && filter2.length == 0) {
     
      data = fullData.filter((d) => {
        let isMentioned = subInfo.some((m) => d.mentioned.includes(m));
        // if (isMentioned) {
        //   result.push(d);
        // }
        return isMentioned;
      });
    } else if (filter1.length == 0 && filter2.length > 0) {
      console.log('check1');
      data = fullData.filter((d) => (d.properties[var2] >= filter2[0] && d.properties[var2] < filter2[1]));
    } else {
      data = [...fullData];
      // new_cuisine_list =  Array.from(new Set(data.map(d => d.properties["max_cuisine"])));
    }
  }
  
</script>

<main>
  <div class="scroll">
    <DataCard data={data} fullData={fullData} numArr={numArr} numCount={numCount} strCount={strCount} update={updateData} bind:filter={filter1} />
  </div>
  <div class="flex-container data-card row">
    <div class="scroll">
      
    </div>
  </div>
  <div class="flex-container row">
    <!-- <div class="map"><Heatmap data={data} fullData={fullData}/></div> -->
    <!-- <div><Scatterplot data={data} fullData={fullData} criteria={criteria}/></div>
     -->
    <div><Histogram2 data={data} fullData={fullData}/></div>
    <!-- <div><BarChart data={data} fullData={fullData} criteria={criteria} update={updateData} bind:filter={filter1}/></div> -->
    <div><Parallel data={data} fullData={fullData} criteria={criteria} update={updateData} bind:filter={filter1}/></div>
  </div>
  <div class="flex-container row">
    <div class="search-bar"><Search></Search></div>
  </div>
  <div class="flex-container row">
    <div class="search-bar"><p>placeholder</p></div>
  </div>
  <!-- <div class="flex-container row"> -->
    <!-- <div class="flex-container row">
      <div class="flex-container col">
        <p>Cuisine Diversity Map</p>
        <div class="map"><Map data={data} fullData={fullData} variable={var1} new_cuisine_list={new_cuisine_list}></Map></div>
        
      </div>
      <div class="flex-container col">
        <p>Most Popular Cuisine</p>
        <div class="map"><Map data={data} fullData={fullData} variable={var3} new_cuisine_list={new_cuisine_list}></Map></div>
        
      </div>
    </div>
    <div class="flex-container row"> -->
    
    
  <!-- </div>
    <div class="flex-container row hist-container">
      <div class="flex-container col">
        <p class="hist-text">Cuisine Count by Zip Code</p>
        <div class="hist"><Histogram data={data} fullData={fullData} variable={var1} bind:filter={filter1} update={updateData}></Histogram></div>
      </div>
      <div class="flex-container col">
        <p class="hist-text">Restaurant Count by Zip Code</p>
        <div class="hist"><Histogram data={data} fullData={fullData} variable={var2} bind:filter={filter2} update={updateData}></Histogram></div>
      </div>
    </div> -->
  <!-- </div> -->
</main>

<style>
  .data-card {
    height: 200px;
    border: 1px solid #ccc;
  }
  .search-bar {
    width: 100%;
    
  }
  .sample-data {
    width: 300px;
    height: 100px;
    
  }
  .sample-data:hover {
    box-shadow: 0px 10px 20px -18px;
  }
  .flex-container {
    display: flex;
    justify-content: center;  
    height: 100%;
    width: 100%;
    padding: 10px;
    gap: 0px;
  }

  .flex-container > div{
    padding: 8px;
  }

  .flex-container .row {
    flex-direction: row;  
  }

  .flex-container .col {
    flex-direction: column;  
  }

  .scroll {
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap; /* Prevent wrapping of child elements */
    height: 250px; /* Adjust height as needed */
    max-width: 100%; /* Constrain scroll container width to its parent */
    padding: 10px;
    box-sizing: border-box; /* Include padding in size calculations */
    border: 1px solid #ccc; /* Optional: border for clarity */
  }

  .scroll > div {
    display: inline-block;
    vertical-align: top; /* Align items to the top for better layout */
    margin-right: 10px; /* Spacing between items */
  }

  .map { 
    flex-grow:1;
  }
			
  .hist { 
    flex-grow:0;
    margin-top: 10px;
  }

  p {
    margin-bottom: 10px;
    font-size: 1.1em;
    text-align: center;
  }

  .hist-text {
    margin-bottom: 10px;
  }

  .sample-data {
    border: 1px solid #ccc;
  }

  .scroll {
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
  }

  .col  {
    display: inline-block;
    /* color: white;
    padding: 14px;
    text-decoration: none; */
  }
  
</style>