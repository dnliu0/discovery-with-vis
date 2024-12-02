<script>
  import * as d3 from 'd3';
	import {onMount} from 'svelte';
  // import.meta.env.VITE_OPENAI_API_KEY;
  import Histogram from './Histogram.svelte';
  import BarChart from './BarChart.svelte';
  import Parallel from './Parallel.svelte';
  import Search from './Search.svelte';
  import DataCard from './DataCard.svelte';

  import OpenAI from "openai";

	let data = [];
  let fullData = [];
  let filter1 = [];
  let filter2 = [];
  let count = 0;
  let numCount = 0;
  let strCount = 0;
  let numArr = [];
  let strArr = [];
  let history = [];
  let searchInput;
  let searchOutput;
  
  let cuisine_list = []

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
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true
});

async function fetchResponse() {

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      "role": "system",
      "content": [
        {
          "type": "text",
          "text": "Analyze which columns from the given dataset have been mentioned by the user, classify their data types, and provide a structured output.\n\nThe provided dataset:\n```\nTitle,Worldwide Gross,Production Budget,Release Year,Content Rating,Running Time,Genre,Creative Type,Rotten Tomatoes Rating,IMDB Rating\nFrom Dusk Till Dawn,25728961,20000000,1996,R,107,Horror,Fantasy,63,7.1\nBroken Arrow,148345997,65000000,1996,R,108,Action,Contemporary Fiction,55,5.8\nCity Hall,20278055,40000000,1996,R,111,Drama,Contemporary Fiction,55,6.1\nHappy Gilmore,38623460,10000000,1996,PG-13,92,Comedy,Contemporary Fiction,58,6.9\nFargo,51204567,7000000,1996,R,87,Thriller,Contemporary Fiction,94,8.3\nThe Craft,55669466,15000000,1996,R,100,Thriller,Fantasy,45,5.9\nTwister,495900000,88000000,1996,PG-13,117,Action,Contemporary Fiction,57,6\n```\n\n# Steps\n\n1. **Extract User Information**: Identify which columns are mentioned in the user's query.\n2. **Determine the Data Type**: Classify the mentioned columns into one of the predefined data types:\n    - Q: Quantitative (Numerical value)\n    - T: Temporal (Date and time values)\n    - O: Ordinal (Ordered, but not numerical)\n    - N: Nominal (Categorical, unordered)\n3. **Generate Response**: Use the extracted columns and data type classification to create a structured output.\n\n# Output Format\n\nThe output should be formatted as follows:\n\n```json\n{\n  \"0\": {\n    \"attributes\": [\"<Column1>\", \"<Column2>\", ...],\n    \"types\": [\"<Type1>\", \"<Type2>\", ...]\n  }\n}\n```\n\nWhere:\n- The `attributes` list contains the names of the mentioned columns.\n- The `types` list contains the respective data type, using the abbreviations (`Q`, `T`, `O`, `N`).\n\n# Examples\n\n**User Query Example**:\nUser query: \"Show me 'Worldwide Gross' and data classified by 'Release Year'.\"\n\n**Reasoning**:\n- Columns identified: \"Worldwide Gross\", \"Release Year\".\n- Data types determined:\n  - \"Worldwide Gross\": Quantitative (`Q`)\n  - \"Release Year\": Temporal (`T`)\n\n**Example Output**:\n```json\n{\n  \"0\": {\n    \"attributes\": [\"Worldwide Gross\", \"Release Year\"],\n    \"types\": [\"Q\", \"T\"]\n  }\n}\n```\n\n# Notes\n\n- Be mindful of different variations in column names that a user might mention (e.g., \"release year\" vs \"Release Year\", \"worldwide gross\" vs \"Worldwide Gross\").\n- Only include columns that are present in the dataset. If a column mentioned by the user is not found, it should not appear in the output.\n- Begin reasoning and analysis before generating conclusions to ensure step-wise accuracy in the output."
        }
      ]
    }
  ],
  response_format: {
    "type": "text"
  },
  temperature: 0.2,
  max_tokens: 2048,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
});

const output = response.choices[0]?.message?.content;
if (output) {
      // Use regex to extract the JSON part
      const jsonMatch = output.match(/{[\s\S]*?}/);
      if (jsonMatch) {
        let jsonString = jsonMatch[0]; // The matched JSON string
        const openingBraceCount = (jsonString.match(/{/g) || []).length;
        const closingBraceCount = (jsonString.match(/}/g) || []).length;

        if (openingBraceCount > closingBraceCount) {
          jsonString = jsonString.replace(/^{/, '');
        }
        console.log(jsonString);
        
      } 
}
}

// fetchResponse();
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
        
      }
      Object.keys(table[0]).forEach(o => {
        if (+table[0][o]) {
          if (o !== 'Release Year') {
            numCount += 1;
            numArr.push(o);
          }
          
        } else {
          strCount += 1;
          strArr.push(o);
        }
      })
      console.log(data);
      fullData = [...data];
    });
	});

  async function updateSearch() {
    if (searchInput.trim() === '') return;

    // Add user input to the history
   
    let formattedInput = {
			role: "user",
			content: [
				{
					type: "text",
					text: searchInput
				}
			]
		};
		console.log(formattedInput);
    history = [...history, formattedInput];
    const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "Analyze which columns from the given dataset have been mentioned by the user, classify their data types, and provide a structured output.\n\nThe provided dataset:\n```\nTitle,Worldwide Gross,Production Budget,Release Year,Content Rating,Running Time,Genre,Creative Type,Rotten Tomatoes Rating,IMDB Rating\nFrom Dusk Till Dawn,25728961,20000000,1996,R,107,Horror,Fantasy,63,7.1\nBroken Arrow,148345997,65000000,1996,R,108,Action,Contemporary Fiction,55,5.8\nCity Hall,20278055,40000000,1996,R,111,Drama,Contemporary Fiction,55,6.1\nHappy Gilmore,38623460,10000000,1996,PG-13,92,Comedy,Contemporary Fiction,58,6.9\nFargo,51204567,7000000,1996,R,87,Thriller,Contemporary Fiction,94,8.3\nThe Craft,55669466,15000000,1996,R,100,Thriller,Fantasy,45,5.9\nTwister,495900000,88000000,1996,PG-13,117,Action,Contemporary Fiction,57,6\n```\n\n# Steps\n\n1. **Extract User Information**: Identify which columns are mentioned in the user's query.\n2. **Determine the Data Type**: Classify the mentioned columns into one of the predefined data types:\n    - Q: Quantitative (Numerical value)\n    - T: Temporal (Date and time values)\n    - O: Ordinal (Ordered, but not numerical)\n    - N: Nominal (Categorical, unordered)\n3. **Generate Response**: Use the extracted columns and data type classification to create a structured output.\n\n# Output Format\n\nThe output should be formatted as follows:\n\n```json\n{\n  \"0\": {\n    \"attributes\": [\"<Column1>\", \"<Column2>\", ...],\n    \"types\": [\"<Type1>\", \"<Type2>\", ...]\n  }\n}\n```\n\nWhere:\n- The `attributes` list contains the names of the mentioned columns.\n- The `types` list contains the respective data type, using the abbreviations (`Q`, `T`, `O`, `N`).\n\n# Examples\n\n**User Query Example**:\nUser query: \"Show me 'Worldwide Gross' and data classified by 'Release Year'.\"\n\n**Reasoning**:\n- Columns identified: \"Worldwide Gross\", \"Release Year\".\n- Data types determined:\n  - \"Worldwide Gross\": Quantitative (`Q`)\n  - \"Release Year\": Temporal (`T`)\n\n**Example Output**:\n```json\n{\n  \"0\": {\n    \"attributes\": [\"Worldwide Gross\", \"Release Year\"],\n    \"types\": [\"Q\", \"T\"]\n  }\n}\n```\n\n# Notes\n\n- Be mindful of different variations in column names that a user might mention (e.g., \"release year\" vs \"Release Year\", \"worldwide gross\" vs \"Worldwide Gross\").\n- Only include columns that are present in the dataset. If a column mentioned by the user is not found, it should not appear in the output.\n- Begin reasoning and analysis before generating conclusions to ensure step-wise accuracy in the output."
          }
        ]
      }, formattedInput
    ],
    response_format: {
      "type": "text"
    },
    temperature: 0.2,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  const output = response.choices[0]?.message?.content;
  history = [...history, response.choices[0]?.message];
  console.log(history)
  if (output) {
        // Use regex to extract the JSON part
        const jsonMatch = output.match(/{[\s\S]*?}/);
        if (jsonMatch) {
          let jsonString = jsonMatch[0]; // The matched JSON string
          const openingBraceCount = (jsonString.match(/{/g) || []).length;
          const closingBraceCount = (jsonString.match(/}/g) || []).length;

          if (openingBraceCount > closingBraceCount) {
            // Remove the first extra `{` if there's an imbalance
            jsonString += '}';
          }
          console.log(jsonString);
          searchOutput = JSON.parse(jsonString);
          console.log(searchOutput)
          // const parsedJSON = JSON.parse(jsonString); // Parse the JSON string
          // console.log("Extracted JSON:", parsedJSON);
        } 
      }
      
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
     
      data = fullData.filter((d) => {
        let isMentioned = subInfo.some((m) => d.mentioned.includes(m));
        // if (isMentioned) {
        //   result.push(d);
        // }
        return isMentioned;
      });
    } else if (filter1.length == 0 && filter2.length > 0) {
      data = fullData.filter((d) => (d.properties[var2] >= filter2[0] && d.properties[var2] < filter2[1]));
    } else {
      data = [...fullData];
      // new_cuisine_list =  Array.from(new Set(data.map(d => d.properties["max_cuisine"])));
    }
  }
  
</script>

<main>
  <div class="scroll">
    <DataCard data={data} fullData={fullData} numArr={numArr} strArr={strArr} 
    numCount={numCount} strCount={strCount}  bind:searchInput={searchInput} 
    updateSearch={updateSearch} update={updateData} bind:filter={filter1}
    searchOutput={searchOutput} />
  </div>
  <div class="talk-history">
    <h3>Talk History</h3>
    <div class="history-list">
      {#each history as item}
        <div class={`history-item ${item.role}`}>
          <strong>{item.role}:</strong> {item.role === "user"? item.content[0].text:item.content}
        </div>
      {/each}
    </div>
  </div>
  <div class="flex-container row">
    <div class="search-bar"><Search bind:searchInput={searchInput} updateSearch={updateSearch}></Search></div>
  </div>
</main>

<style>
  .talk-history {
    margin-top: 1em;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;

  }

  .history-list {
    max-height: 300px;
    overflow-y: auto;
    padding: 0.5em;
  }

  .history-item {
    margin-bottom: 0.5em;
    padding: 0.5em;
    border-radius: 4px;
    max-width: 48%; /* Limit chat item width */
    word-wrap: break-word; 
  }

  .history-item.user {
    background-color: #e3f2fd;
    text-align: left;
    margin-left: auto; 
  }

  .history-item.assistant {
    background-color: #ede7f6;
    text-align: left;
    margin-right: auto;
  }


  .data-card {
    height: 300px;
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
    white-space: nowrap; 
    height: 360px; 
    max-width: 100%; 
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .scroll > div {
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
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