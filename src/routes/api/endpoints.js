var Handlers = require('./handlers');
var findHandler = require('./findHandler');
var loginHandler = require('./loginHandler');

//Joi is Hapi's validation library
Joi = require('joi');

var internals = {};

const latLonModel = Joi.object({
	lat: Joi.number(),
	lon: Joi.number()
});

const ListResultModel = Joi.object({
	adsID: Joi.string(),
	gia: Joi.number().allow(null),
	giaFmt: Joi.string().allow(null),
	dienTich: Joi.number().allow(null),
	dienTichFmt: Joi.string().allow(null),
	soPhongNgu: Joi.number().allow(null),
	soPhongNguFmt: Joi.string().allow(null),
	soTang: Joi.number().allow(null),
	soTangFmt: Joi.string().allow(null),
	image: Joi.object({
		cover: Joi.string(),
		images: Joi.array().items(Joi.string())
	}),
	diaChi: Joi.string().allow(null),
	ngayDangTin: Joi.string().allow(null),
	giaM2: Joi.number().allow(null),
	loaiNhaDat: Joi.number().allow(null),
	loaiTin: Joi.number().integer().allow(null),
	huongNha: Joi.number().integer().allow(null),
	chiTiet: Joi.string().allow(null),
	soNgayDaDangTin: Joi.number().allow(null),
	soPhongTam: Joi.number().allow(null),

	//should not have?
	area_raw: Joi.any(),
	dangBoi: Joi.any(),
	maSo: Joi.any(),
	place: Joi.any(),
	price_raw: Joi.any(),
	ten_loaiNhaDat: Joi.any(),
	ten_loaiTin: Joi.any(),
	title: Joi.any(),
	type: Joi.any(),
	distance: Joi.any()
});

const DetailResultModel = Joi.object({
	adsID: Joi.string(),
	area_raw: Joi.string().allow(null),
	dangBoi: Joi.object({
		email: Joi.string().allow(null),
		name : Joi.string().allow(null),
		phone: Joi.string().allow(null),
		userID: Joi.string().allow(null)
	}),
	gia: Joi.number(),
	giaFmt: Joi.string(),
	dienTich: Joi.number(),
	dienTichFmt: Joi.string(),
	soPhongNgu: Joi.number(),
	soPhongNguFmt: Joi.string(),
	soTang: Joi.number(),
	soTangFmt: Joi.string(),
	image: Joi.object({
		cover: Joi.string(),
		images: Joi.array().items(Joi.string()),
		images_small:  Joi.array().items(Joi.string()),
	}),
	diaChi: Joi.string(),
	ngayDangTin: Joi.string(),
	giaM2: Joi.number(),
	loaiNhaDat: Joi.number(),
	loaiTin: Joi.number().integer(),
	huongNha: Joi.number().integer(),
	chiTiet: Joi.string(),
	soNgayDaDangTin: Joi.number().description('So ngay da dang tin'),
	place : Joi.object({
		duAn: Joi.string(),
		diaChi: Joi.string(),
		diaChinh: Joi.object(),
		geo: latLonModel,
		diaChinhFullName: Joi.string(),
		duAnFullName: Joi.any()
	}),
	maSo: Joi.number(),
	price_raw: Joi.string(),
	ten_loaiNhaDat : Joi.string(),
	ten_loaiTin: Joi.string(),
	title: Joi.string(),
	soNgayDaDangTinFmt: Joi.string(),
	ngayDangTinFmt: Joi.string(),
	luotXem: Joi.number(),
	moiGioiTuongTu: Joi.array(),
	loaiTinFmt: Joi.string(),
	loaiNhaDatFmt: Joi.string(),
	type: Joi.string(),
	soPhongTam: Joi.number(),
	soPhongTamFmt: Joi.string(),
});


internals.endpoints = [
	{
		method: 'POST', 
		path: '/api/find',
		handler: findHandler.search,
		config : {
			description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
			tags: ['api'],
			notes: 'Theo 4 loai: geoBox, polygon, diaDiem(banKinh), diaChinh(tinh/huyen/xa)',
			/*
			validate: {
				payload: {
					loaiTin: Joi.number().integer().min(0).max(1).required()
						.description('0=BAN, 1 = THUE') ,
					loaiNhaDat: Joi.number().integer().min(1).max(10)
						.description('1,2,... (tham khao trong https://github.com/reway/bds/blob/master/src/assets/DanhMuc.js)'),
					giaBETWEEN: Joi.array().items(Joi.number()).length(2)
						.description('don vi la` TRIEU (voi THUE la trieu/thang)'),
					dienTichBETWEEN:Joi.array().items(Joi.number()).length(2)
						.description('don vi la` m2'),
					ngayDaDang: Joi.number().integer()
						.description('So ngay da dang'),
					soPhongNguGREATER: Joi.number().integer(),
					soPhongTamGREATER: Joi.number().integer(),
					soTangGREATER: Joi.number().integer(),

					huongNha: Joi.number().integer()
						.description('tham khao trong https://github.com/reway/bds/blob/master/src/assets/DanhMuc.js'),
					geoBox: Joi.array().length(4)
						.description('Tim kiem theo viewport tren MAP: [southwest_lat, southwest_lon, northeast_lat, northeast_lon]'),
					polygon: Joi.array()
						.description('Tim kiem theo polygon tren MAP: [{lat, lon}, {}]'),
					place: Joi.object({
						placeId: Joi.string().description('Lay tu google place'),
						relandTypeName: Joi.string().description('De thong nhat giua client-server, mandatory for PLACE'),
						radiusInKm: Joi.number(),
						currentLocation: Joi.object({
							lat:Joi.number(),
							lon:Joi.number()}
						),
						fullName: Joi.string()
					}),
					limit: Joi.number(),
					orderBy : Joi.string()
						.description('ngayDangTinDESC/giaASC/giaDESC/dienTichASC, soPhongTamASC, soPhongNguASC'),
					page: Joi.number()
				}
			},
			response: {
				schema: {
					length: Joi.number().integer(),
					list: Joi.array().items(ListResultModel),
					viewport: Joi.object({
						center: Joi.object({
							lat: Joi.number(),
							lon: Joi.number(),
							formatted_address: Joi.string(),
							name: Joi.string().description('Ten diem - su dung khi di chuyen MAP')
						}),
						northeast:latLonModel, southwest:latLonModel
					}).description('Neu theo DiaDiem hoac CurrentLocation: box bao cua Hinh Tron. Neu theo Tinh/Huyen/Xa: lay viewport tu google place')
				}
			}
			*/
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
			tags: ['api'],
			/*
			response: {
				schema: Joi.object({
					status: Joi.number(),
					ads: DetailResultModel
					//ads: Joi.object()
				})
			},
			validate_backup: {
				payload: {
					adsID: Joi.string().default('Ads_bds_2884742')
				}
			}
			*/
		}
	},
	{
        method: 'POST',
        path: '/api/count',
        handler: findHandler.count,
        config : {
            description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
            tags: ['api']
        }
	},
	{
        method: 'POST',
        path: '/api/saveSearch',
        handler: Handlers.saveSearch,
        config : {
            description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
            tags: ['api'],
			auth: 'jwt'
        }
	},
	{
        method: 'POST',
        path: '/api/checkUserExist',
        handler: loginHandler.checkUserExist,
        config : {
            description: 'Kiem tra xem user da ton tai chua',
            tags: ['api']
        }
	},
	{
        method: 'POST',
        path: '/api/login',
        handler: loginHandler.login,
        config : {
            description: 'login',
            tags: ['api']
        }
	},
	{
        method: 'POST',
        path: '/api/signup',
        handler: loginHandler.signup,
        config : {
            description: 'login',
            tags: ['api']
        }
	}


];

module.exports = internals;