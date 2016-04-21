'use strict';

var React = require('react');
var Layout = require('./layout.jsx');


export default class Component extends React.Component{
	allData() {
		return (

			this.props.allAds.map(function(oneDoc) {
                var one = oneDoc.value;
		        return <li> <img src = {one.cover}/> <span> {one.title} </span> </li>
            })
		)
	}
    render() {
       return (
            <Layout title="ViewAll Page">
                <h1>ViewAll</h1>
                <h2> Total records : {this.props.allAds.length} </h2>
                <ol>
                {this.allData()}
                </ol>
            </Layout>
        );
    }
};

