<script>
    export let updateSearch;
    export let searchInput;
	let value = '';

    function updateValue() {
        searchInput = value;
        updateSearch();
        value = '';
		console.log('Search value:', value); // You can replace this with any logic to handle the search
	}
</script>

<input bind:value={value} placeholder="Message" />
<button on:click={updateValue}>Send</button>


<style>
    input {
        width: 90%;
        height: 100%;
        padding-inline: 7px;
        padding-block: 2px;
        border: 1px solid #ccc;
        /* background-color: #f5f5f5; */
        color: #242424;
    }
    button {
        height: 100%;
        padding: 10px 30px;
        border: none;
        background-color: #ccc;
        color: white;
        cursor: pointer;
        box-shadow: 0px 10px 20px -18px;
        margin-left: 8px;
    }

    button:hover {
        background-color: #0056b3;
    }

    div {
        display: flex;
        align-items: center;
    }
</style>