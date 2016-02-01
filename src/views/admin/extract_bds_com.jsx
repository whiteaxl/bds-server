import React from 'react';
var Layout = require('./layout.jsx');


export default class ExtractBDS extends React.Component {
	render() {
		return (
            <Layout title="Extract BDS">
                <h1>Done extracting from BDS</h1>
                <div> Duration: {this.props.duration} ms </div>
                <div> Count: {this.props.count} </div>
                <div> Count Inserted: {this.props.countInsert} </div>
            </Layout>
        );
	}
}