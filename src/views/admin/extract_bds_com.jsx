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
            pageFrom: 1, 
            pageTo: 2, 
            result: "Init"
        }
    }

	render() {
		return (
            <Layout title="Extract BDS">
                <li> <h2> Extract data from BDS </h2> </li>
                <form>
                    <label> From Page: </label> 
                    <input id="pageFrom" name="pageFrom" value={this.state.pageFrom} onChange={this._onChange} />
                    
                    <label> To Page: </label> 
                    <input id="pageTo" name="pageTo"  value={this.state.pageTo}  onChange={this._onChange} />
                    
                    <button type="Submit"><b>Extract</b> </button>
                    
                </form>

                <br/>

                
                <li><h2>Result of extracting from BDS</h2> </li>
                <div> Duration: {this.props.duration} ms </div>
                <div> Count: {this.props.count} </div>
            </Layout>
        );
	}
}