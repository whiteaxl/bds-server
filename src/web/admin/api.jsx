'use strict';

var React = require('react');
var Layout = require('./layout.jsx');


export default class Component extends React.Component{
	
    render() {
       return (
            <Layout title="API Usages Page">
                <li> Find bds </li>
                <span>
                	curl -H "Content-Type: application/json" -X POST -d '{"loaiTin":0,"loaiNhaDat":2}' http://203.162.13.101:5000/api/find
                </span>
            </Layout>
        );
    }
};

