import React from 'react';
var Layout = require('./layout.jsx');


export default class ExtractBDS extends React.Component {
    constructor() {
        super();
        this.state = this.initialState();
    }

    initialState() {
        return {
          result: 'Init',
          phone: '',
          email: '',
        }
    }

	render() {
		return (
            <Layout title="Delete mobile user">
                <li> <h2> Delete mobile user </h2> </li>
                <form >
                    <label> Phone: </label>
                    <input id="phone" name="phone" value={this.state.phone}  />
                    
                    <br/>

                    <label> Email: </label>
                    <input id="email" name="email" value={this.state.email} />

                    <button type="Submit"><b>Delete</b> </button>
                </form>

                <br/>
                <br/>

                <li><h2>Result of delete mobile user</h2> </li>
                <div> result: {this.props.result} </div>
            </Layout>
        );
	}
}