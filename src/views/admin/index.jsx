'use strict';

var React = require('react');
var Layout = require('./layout.jsx');
//var Http = require('http');
var $ = require('jquery');


export default class Component extends React.Component{
    

    render() {
       return (
            <Layout title="Admin Page">
                <h1>Administration</h1>
                
                <li> <h2> Extract </h2> </li>
                <a href='/admin/extract/bds_com'> From BDS </a>
                                
                <li> <h2> View </h2> </li>
                <a href='/admin/viewall'> ViewAll </a>

                <li> <h2> API </h2> </li>
                <a href='/admin/api_usage'> API Usage </a>

                <li> <h2> LoadData </h2> </li>
                <a href='/admin/loadData'> Load Data </a>
            </Layout>
        );
    }
};

