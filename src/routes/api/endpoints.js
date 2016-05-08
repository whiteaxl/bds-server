var Handlers = require('./handlers');
var findHandler = require('./findHandler');

var internals = {};

internals.endpoints = [
	{
		method: 'POST', 
		path: '/api/find',
		handler: findHandler.search,
		config : {
			description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
			tags: ['api']
		}
	},
	{
		method: 'POST',
		path: '/api/findRecent',
		handler: Handlers.findRencentAds,
		config : {
			description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
			tags: ['api']
		}
	},
	{
		method: 'POST',
		path: '/api/findBelowPrice',
		handler: Handlers.findBelowPriceAds,
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
        path: '/api/search',
        handler: findHandler.search,
        config : {
            description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
            tags: ['api']
        }
}

];

module.exports = internals;