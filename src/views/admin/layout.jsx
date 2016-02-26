var React = require('react');



var Component = React.createClass({
    render: function () {

        return (
            <html>
                <head>
                    <title>{this.props.title}</title>
                </head>
                <body>
                    {this.props.children}
                    <hr />
                    <p>
                        <a href="/admin">Home</a> | <a href="/admin/viewall"> View All </a>| <a href="/about">About Us</a>
                    </p>
                </body>
            </html>
        );
    }
});


module.exports = Component;