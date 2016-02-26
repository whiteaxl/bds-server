'use strict';

var React = require('react');
var Layout = require('./layout.jsx');


export default class Component extends React.Component{
    render() {
       return (
            <Layout title="Home Page">
                <h1>Administration</h1>
                <a href='/admin/extract/bds_com'> Extract data from BDS </a>
                <br/>
                <a href='/admin/viewall'> ViewAll </a>
                
            </Layout>
        );
    }
};

