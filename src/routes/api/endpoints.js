var Handlers = require('./handlers');
var UserHandlers = require("./userHandlers");

var internals = {};

internals.endpoints = [
{
	method: 'POST', 
	path: '/api/find', 
	handler: Handlers.findPOST, 
	config : {
		description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
		tags: ['api']
	}
},
{
	method: 'POST', 
	path: '/api/findGooglePlaceById', 
	handler: Handlers.findGooglePlaceById, 
	config : {
		description: 'Get google place detail by id.',
		notes: 'api',
		tags: ['api']
	}
},
	{
		method: 'POST',
		path: '/api/detail',
		handler: Handlers.detail,
		config : {
			description: 'Chi tiet cua mot bai dang',
			tags: ['api']
		}
	},
	{
		method: 'POST',
		path: '/api/user/create',
		handler: UserHandlers.create,
		config : {
			description: 'Tao nguoi dung khi thuc hien Dang Nhap Khong Can Dang Ky',
			tags: ['api']
		}
	}
];

module.exports = internals;