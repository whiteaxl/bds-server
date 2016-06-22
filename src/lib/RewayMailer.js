'use strict';
var RewayMailer = {};

var generator = require('xoauth2').createXOAuth2Generator({
	// user: 'tim.hung.dao@gmail.com',
	user: 'support@reland.vn',
	// clientId: '695617178682-t9ojtonmgk4eiukmpksk7flfut4vl95r.apps.googleusercontent.com',
	// clientSecret: '_VcjOUp3G_83_4QVQ8bIJBL-',
	clientId: '373321723504-qlpu6bf2bnhgv57o2vaqa0vtjfvmgjuq.apps.googleusercontent.com',
	clientSecret: '8ey5xSBJHTCUMXUXj6AZCplo',
	refreshToken: '1/trdDyvimLIMVKvpp4dy3m150qbirli4SP8MeFOu_4zM'
});

// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token){
	console.log('New token for %s: %s', token.user, token.accessToken);
});

var nodemailer = require('nodemailer');
// login
var transporter = nodemailer.createTransport(({
	service: 'gmail',
	auth: {
		xoauth2: generator
	}
}));

// send mail


RewayMailer.sendMail  = function(mailData,callback){
	transporter.sendMail({
		// from: mailData.from,
		// to: mailData.to,
		from: 'support@reland.vn',
		to: 'support@reland.vn',
		subject: mailData.subject,
		text: mailData.text,
		html: mailData.html
	}, function(error, response) {
		callback(error,response);
		/*if (error) {
			console.log(error);
			result.success = false;
			reply(result);
		} else {
			console.log('Message sent');
			result.success = true;
			result.sentMail = true;
			result.msg = "Mail đã gửi thành công"
			reply(result);
		}*/
	});

}


module.exports = RewayMailer;