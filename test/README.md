You can explore the system here: https://rainbow-biscotti-bf38ea.netlify.app/

Alternatively, run it locally by following these steps:
1. Replace import.meta.env.VITE_OPENAI_API_KEY in App.svelte with your OpenAI API key
2. In your terminal, execute the following commands:
npm install  
npm run dev 

Generate an API Key:
To create your GPT API key, generate it here (https://platform.openai.com/settings/proj_wtaA5HJ6hWsRlGcWmd0rDgkX/api-keys) after setting up your OpenAI account.

The system uses the gpt-4o-mini model. Ensure it is enabled for your account by visiting: https://platform.openai.com/settings/proj_wtaA5HJ6hWsRlGcWmd0rDgkX/limits

Default View: Displays the distribution of each column and relationships between two variables (if the number of unique values in ordinal or nominal data columns is manageable).

Dataset: The embedded dataset used is (https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv)


Type queries into the search box to specify the visualization you want to see.
Some Valid Examples: 
1. "Show me the relationship between budget and worldwide gross."
2. "What is the distribution of budget?"
3. "Show me the distribution of movie genre."

The system supports queries for visualizing up to two columns, similar to its default visualization functionality.