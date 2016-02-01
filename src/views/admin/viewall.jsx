'use strict';

var React = require('react');
var Layout = require('./layout.jsx');


export default class Component extends React.Component{
	allData() {
		return (

			this.props.allAds.map(function(one) {
		        return <div> {one.title} </div>
            })
		)
	}
    render() {
       return (
            <Layout title="ViewAll Page">
                <h1>ViewAll</h1>
                <h2> count : {this.props.allAds.length} </h2>
                {this.allData()}
            </Layout>
        );
    }
};

