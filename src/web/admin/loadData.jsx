import React from 'react';
var Layout = require('./layout.jsx');


export default class ExtractBDS extends React.Component {
    constructor() {
        super();
        console.log("call me 1")
        this.state = this.initialState();
    }

    initialState() {
        return {
            jsonFileName : "tinh",
            jsonFileNameQuan : "quan"
        }
    }

    render() {
        return (
            <Layout title="Load PLACES">
        <li> <h2> Load PLACES:</h2> </li>
        <form >
        <label> Json fileName: (tinh/huyen/duongPho/duAn/xa)</label>
        <br/>
        <input id="jsonFileName" name="jsonFileName" size="100" value={this.state.jsonFileName}  />
            <br/>
        <input id="jsonFileNameQuan" name="jsonFileNameQuan" size="100" value={this.state.jsonFileNameQuan}  />

<br/>

    <button type="Submit"><b>Load</b> </button>

    </form>

    <br/>

    </Layout>
);
}
}