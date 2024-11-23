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

	let data = [];
  let data2 = [];
  let fullData = [];
  let filter1 = [];
  let filter2 = [];
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
          //'ZIPCODE': d['ZIPCODE'].toString().slice(0, 5),
          // 'Information Used' : d['Information Used'].split(', '), 
          // 'Information Used_N' : d['Information Used_N'].split(', '), 
        }));

    
    await Promise.all([table]).then((values) => {
      // console.log(values);
      let table = values[0];
      let aspects = [];
      criteria = Object.keys(table[0]);
      let criteriaMentioned = [];
      for (let i = 0; i < 68; i++) {
        data.push({});
        data[i]['idx'] = i;
        let count = 0;
        Object.keys(table[0]).forEach(o => {
          if (o) {
            data[i][o] = +table[i][o];
            if (table[i][o] === "1") {
              count += 1;
              criteriaMentioned.push(o)
            }
          }
          
        });
        data[i]['count'] = count;
        data[i]['mentioned'] = criteriaMentioned;
        criteriaMentioned = [];
        // data[i]['Information Used'] = table[i]['Information Used'];
        // if (table[i]['Data Meet Purpose'] === "Yes") {
        //   aspects.push('Data Meet Purpose');
        // }
        // if (table[i]['Data Quality Check'] === "Yes") {
        //   aspects.push('Data Quality Check');
        // }
        // if (table[i]['Pay Access Decision'] === "Yes") {
        //   aspects.push('Pay Access Decision');
        // }
        // data[i]['aspects'] = aspects;
        // aspects = [];
        // data[i]['Data Meet Purpose'] = table[i]['Data Meet Purpose'];
        // data[i]['Data Quality Check'] = table[i]['Data Quality Check'];
        // data[i]['Pay Access Decision'] = table[i]['Pay Access Decision'];
        // data[i]['Heatmap'] = getCount();
        // data[i]['Information Used_N'] = table[i]['Information Used_N'];
        // data[i]['Data Meet Purpose_N'] = table[i]['Data Meet Purpose_N'];
        // data[i]['Data Quality Check_N'] = table[i]['Data Quality Check_N'];
        // data[i]['Pay Access Decision_N'] = table[i]['Pay Access Decision_N'];
      }
      console.log(data);
      //console.log(data);
      fullData = [...data];
    });
	});
  function getDiversity(table){
    let zip_count = {};
    for (let k = 0; k < table.length; k++) {
      let curr_zip = table[k]['ZIPCODE'];
      let cuisine = table[k]['CUISINE DESCRIPTION'];
      if (!zip_count[curr_zip]) {
            zip_count[curr_zip] = {};
      }
          if (zip_count[curr_zip][cuisine]) {
            zip_count[curr_zip][cuisine] += 1;
          } else {
            zip_count[curr_zip][cuisine] = 1;
          }
              
    }
    let diversity_count = {};
      
      for (let z in zip_count) {
          diversity_count[z] = Object.keys(zip_count[z]).length;
      }
      return diversity_count;  
  }

  function getCount(){
    let heatmapData = [];
    let combineMap = new Map();
    fullData.forEach(d => {
        uniqueAspects.forEach(a => {
            uniqueInfoUsed.forEach(i => {
            if (d['aspects'].includes(a) && d['Information Used'].includes(i)) {
                let key = `${a}-${i}`;
                if (!combineMap.has(key)) {
                    combineMap.set(key, 0);
                    heatmapData.push({ aspect: a, info: i, count: 0 });
                } else {
                    combineMap.set(key, combineMap.get(key) + 1);
                    let entry = heatmapData.find(entry => entry.aspect === a && entry.info === i);
                    if (entry) {
                        entry.count++; 
                    }
                }
            }
            })
        })
    });
  
}

  function countByCuisine(table){
    let zip_count = {};
        for (let k = 0; k < table.length; k++) {
          let curr_zip = table[k]['ZIPCODE'];
          let cuisine = table[k]['CUISINE DESCRIPTION'];
          
          if (!zip_count[curr_zip]) {
            zip_count[curr_zip] = {};
          }
          if (zip_count[curr_zip][cuisine]) {
            zip_count[curr_zip][cuisine] += 1;
            
          } else {
            zip_count[curr_zip][cuisine] = 1;
          }
        }
        let max_cuisine_per_zip = {};
        for (let z in zip_count) {
          let cuisine_types = zip_count[z];
          let max_cuisine;
          let max_num = -1;
          for (let a in cuisine_types) {
              if (cuisine_types[a] > max_num) {
                  max_cuisine = a;
                  max_num = cuisine_types[a];
              }
          }
          max_cuisine_per_zip[z] = {
              cuisine: max_cuisine,
              count: max_num
          };
      }
      return max_cuisine_per_zip;
  
}

  function countByAnimalType(table){
    let zip_count = {};
        for (let k = 0; k < table.length; k++) {
          let curr_zip = table[k]['Incident Zip'];
          let animal = table[k]['Descriptor'];
          
          if (!zip_count[curr_zip]) {
            zip_count[curr_zip] = {};
          }
          if (zip_count[curr_zip][animal]) {
            zip_count[curr_zip][animal] += 1;
            
          } else {
            zip_count[curr_zip][animal] = 1;
          }
        }
        let max_animal_per_zip = {};
        for (let z in zip_count) {
          let animal_types = zip_count[z];
          let max_animal;
          let max_num = -1;
          for (let a in animal_types) {
              if (animal_types[a] > max_num) {
                  max_animal = a;
                  max_num = animal_types[a];
              }
          }
          max_animal_per_zip[z] = {
              animal: max_animal,
              count: max_num
          };
      }
      return max_animal_per_zip;
  }

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
      let result = [];
      let result2 = [];
      // data2 = fullData.filter((d) => {
      //     // Check if any elements of subInfo are mentioned
          
      //     let isMentioned = subInfo.some((m) => d.mentioned.includes(m));
      //     if (isMentioned) {
      //       let temp = { ...d };
      //         // Update the mentioned property to include only elements that match subInfo
      //         temp.mentioned = d.mentioned.filter(m => subInfo.includes(m));
      //         return temp;
      //     }
      //     return isMentioned;
      // });
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
  <!-- <h1>NYC Restaurants</h1> -->
  <div class="flex-container row">
    <div class="scroll">
      <div class="col">
        <div class="sample-data"></div>
      </div>
      <div class="col">
        <div class="sample-data"></div>
      </div>
      <div class="col">
        <div class="sample-data"></div>
      </div>
      <div class="col">
        <div class="sample-data"></div>
      </div>
      <div class="col">
        <div class="sample-data"></div>
      </div>
    </div>
  </div>
  <div class="flex-container row">
    <!-- <div class="map"><Heatmap data={data} fullData={fullData}/></div> -->
    <!-- <div><Scatterplot data={data} fullData={fullData} criteria={criteria}/></div>
     -->
    <div><Histogram2 data={data} fullData={fullData} criteria={criteria}/></div>
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
  .search-bar {
    width: 100%;
  }
  .sample-data {
    width: 300px;
    height: 260px;
  }
  .sample-data:hover {
    box-shadow: 0px 10px 20px -18px;
  }
  .flex-container {
    display: flex;
    justify-content: center;  
    height: 100%;
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