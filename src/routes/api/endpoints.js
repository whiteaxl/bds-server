var Handlers = require('./handlers');
var findHandler = require('./findHandler');
var findHandlerV2 = require('./findHandlerV2');
var adsHandler = require('./adsHandler');
var loginHandler = require('./loginHandler');
var fileUploadHandler = require('./fileUploadHandler');

var userHandlers = require('./userHandlers');
var newsHandlers = require('./newsHandlers');
var homeDataHandlers = require('./homeDataHandlers');
var homeDataHandlersV2 = require('./homeDataHandlersV2');
var placeHandlers = require('./placeHandlers');

var onepay = require("./onepayHandlers");
var onepaySim = require("./onepaySimHandlers");

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
  giaFmtForWeb: Joi.string().allow(null),
  dienTich: Joi.number().allow(null),
  dienTichFmt: Joi.string().allow(null),
  soPhongNgu: Joi.number().allow(null),
  soPhongNguFmt: Joi.string().allow(null),
  soTang: Joi.number().allow(null),
  soTangFmt: Joi.string().allow(null),
  image: Joi.object({
    cover: Joi.string().allow(null),
    images: Joi.array().items(Joi.string())
  }),
  diaChi: Joi.string().allow(null),
  ngayDangTin: Joi.string().allow(null),
  giaM2: Joi.number().allow(null),
  loaiNhaDat: Joi.number().allow(null),
  loaiTin: Joi.number().integer().allow(null),
  huongNha: Joi.number().integer().allow(null),
  soNgayDaDangTin: Joi.number().allow(null),
  soPhongTam: Joi.number().allow(null),
  soPhongTamFmt : Joi.string().allow(null),
  distance: Joi.number().allow(null),
  place: Joi.any(),

  //should not have?
  ten_loaiNhaDat: Joi.any(),
  ten_loaiTin: Joi.any(),
});

const PointModel = Joi.object({
  lat : Joi.number(),
  lon: Joi.number()
});

const DetailResultModel = Joi.object({
  adsID: Joi.string(),
  area_raw: Joi.string().allow(null).allow(''),
  dangBoi: Joi.object({
    email: Joi.string().allow(null).allow(''),
    name: Joi.string().allow(null).allow(''),
    phone: Joi.string().allow(null).allow(''),
    userID: Joi.string().allow(null).allow('')
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
    images_small: Joi.array().items(Joi.string()),
  }),
  diaChi: Joi.string().allow(null).allow(''),
  ngayDangTin: Joi.string(),
  giaM2: Joi.number(),
  loaiNhaDat: Joi.number(),
  loaiTin: Joi.number().integer(),
  huongNha: Joi.number().integer(),
  huongNhaFmt: Joi.string(),
  chiTiet: Joi.string().allow(null).allow(''),
  soNgayDaDangTin: Joi.number().description('So ngay da dang tin'),
  place: Joi.object({
    duAn: Joi.string().allow(null).allow(''),
    diaChi: Joi.string().allow(null).allow(''),
    diaChinh: Joi.object(),
    geo: latLonModel,
    diaChinhFullName: Joi.string().allow(null).allow(''),
    duAnFullName: Joi.any()
  }),
  maSo: Joi.number(),
  price_raw: Joi.string().allow(null).allow(''),
  ten_loaiNhaDat: Joi.string().allow(null).allow(''),
  ten_loaiTin: Joi.string().allow(null).allow(''),
  title: Joi.string().allow(null).allow(''),
  soNgayDaDangTinFmt: Joi.string(),
  ngayDangTinFmt: Joi.string(),
  luotXem: Joi.number(),
  moiGioiTuongTu: Joi.array(),
  loaiTinFmt: Joi.string(),
  loaiNhaDatFmt: Joi.string(),
  type: Joi.string(),
  soPhongTam: Joi.number(),
  soPhongTamFmt: Joi.string().allow(null).allow(''),
  giaM2Fmt:Joi.string(),
  maSo:Joi.string(),
});


internals.endpoints = [
  {
    method: 'POST',
    path: '/api/find',
    handler: findHandler.search,
    config: {
      description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
      tags: ['api'],
      notes: 'Theo 4 loai: geoBox, polygon, diaDiem(banKinh), diaChinh(tinh/huyen/xa)',
    }
  },
  {
    method: 'POST',
    path: '/api/findAds',
    handler: findHandler.searchAdsNew,
    config: {
      description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
      tags: ['api'],
      notes: 'Theo 4 loai: geoBox, polygon, diaDiem(banKinh), diaChinh(tinh/huyen/xa)',
    }
  },
  {
    method: 'POST',
    path: '/api/findRecent',
    handler: Handlers.findRencentAds,
    config: {
      description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/findBelowPrice',
    handler: Handlers.findBelowPriceAds,
    config: {
      description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/findGooglePlaceById',
    handler: Handlers.findGooglePlaceById,
    config: {
      description: 'Get google place detail by id.',
      notes: 'api',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/detail',
    handler: Handlers.detail,
    config: {
      description: 'Chi tiet cua mot bai dang',
      tags: ['api'],

      response: {
        schema: Joi.object({
          status: Joi.number(),
          ads: DetailResultModel
          //ads: Joi.object()
        })
      },
      validate: {
        payload: {
          adsID: Joi.string(),
          userID: Joi.string().allow(null)
        }
      }

    }
  },
  {
    method: 'POST',
    path: '/api/postAds',
    handler: adsHandler.postAds,
    config: {
      description: 'post Ads',
      tags: ['api'],
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/count',
    handler: findHandler.count,
    config: {
      description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/countAds',
    handler: findHandler.countAdsNew,
    config: {
      description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/saveSearch',
    handler: Handlers.saveSearch,
    config: {
      description: 'Luu tim kiem',
      tags: ['api'],
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/checkUserExist',
    handler: loginHandler.checkUserExist,
    config: {
      description: 'Kiem tra xem user da ton tai chua',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/login',
    handler: loginHandler.login,
    config: {
      description: 'login',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/signup',
    handler: loginHandler.signup,
    config: {
      description: 'signup',
      tags: ['api']
    }
  },

  {
    method: 'POST',
    path: '/api/user/requestVerifyCode',
    handler: userHandlers.requestVerifyCode,
    config: {
      description: 'Lay verifyCode de dang ky theo sdt (SMS)',
      tags: ['api'],
      validate: {
        payload: {
          phone: Joi.string()
        }
      },

      response: {
        schema: Joi.object({
          status: Joi.number(),
          verifyCode: Joi.number().min(0).max(9999),
          msg: Joi.string()
        })
      }
    }
  },

  {
    method: 'POST',
    path: '/api/user/registerUser',
    handler: userHandlers.registerUser,
    config: {
      description: 'Dang ky user: tao tren syncGateway',
      tags: ['api'],
      validate: {
        payload: {
          phone: Joi.string(),
          email: Joi.string(),
          matKhau: Joi.string().required(),
          fullName: Joi.string().required(),
          avatar: Joi.string()
        }
      },

      response: {
        schema: Joi.object({
          status: Joi.number(),
          res: Joi.object(),
          msg: Joi.string()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/upload',
    handler: fileUploadHandler.uploadFiles,
    config: {
      description: 'login',
      payload: {
        maxBytes: 209715200,
        output: 'stream',
        parse: false
      },
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/likeAds',
    handler: Handlers.likeAds,
    config: {
      description: 'Like Ads - Se dua adsID vao ds user.adsLikes',
      tags: ['api'],
      validate: {
        payload: {
          userID: Joi.string().required(),
          adsID: Joi.string().required(),
        }
      },

      response: {
        schema: Joi.object({
          status: Joi.number(),
          success: Joi.boolean(),
          msg: Joi.string(),
          adsLikes: Joi.array()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/unlikeAds',
    handler: Handlers.unlikeAds,
    config: {
      description: 'Unlike Ads - Se loai bo adsID khoi ds user.adsLikes',
      tags: ['api'],
      validate: {
        payload: {
          userID: Joi.string().required(),
          adsID: Joi.string().required(),
        }
      },

      response: {
        schema: Joi.object({
          status: Joi.number(),
          success: Joi.boolean(),
          msg: Joi.string(),
          adsLikes: Joi.array()
        })
      }
    }
  },
  //todo: can viet lai bang cach truyen list adsID, de bao mat thong tin
  {
    method: 'POST',
    path: '/api/user/getAdsLikes',
    handler: userHandlers.getAdsLikes,
    config: {
      description: 'Lay ds likes cua mot user',
      tags: ['api'],
      validate: {
        payload: {
          userID: Joi.string().required(),
        }
      },

      response: {
        schema: Joi.object({
          data: Joi.array(),
          status: Joi.number().required(),
          msg: Joi.string()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/user/getMyAds',
    handler: userHandlers.getMyAds,
    config: {
      description: 'Lay ds Ads da dang cua mot user',
      tags: ['api'],
      validate: {
        payload: {
          userID: Joi.string().required(),
        }
      },

      response: {
        schema: Joi.object({
          data: Joi.array(),
          status: Joi.number().required(),
          msg: Joi.string()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/requestInfo',
    handler: Handlers.requestInfo,
    config: {
      description: 'sendEmail to nguoi dang tin', 
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/reportReland',
    handler: Handlers.reportReland,
    config: {
      description: 'report for Reland', 
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/countNews',
    handler: newsHandlers.countNews,
    config: {
      description: 'dem danh sach tintuc',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/forgotPassword',
    handler: loginHandler.forgotPassword,
    config: {
      description: 'sendEmail,sms to user', 
    }
  },
  {
    method: 'POST',
    path: '/api/resetPassword',
    handler: loginHandler.resetPassword,
    config: {
      description: 'resetPassword', 
      tags: ['api']      
    }
  },
  {
    method: 'POST',
    path: '/api/findNews',
    handler: newsHandlers.findNews,
    config: {
      description: 'Lay danh sach tintuc',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/increaseRating',
    handler: newsHandlers.increaseRating,
    config: {
      description: 'Lay danh sach tintuc',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/findHightestArticle',
    handler: newsHandlers.findHightestArticle,
    config: {
      description: 'Lay danh sach tintuc xem nhieu nhat',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/findHotArticle',
    handler: newsHandlers.findHotArticle,
    config: {
      description: 'Lay danh sach tintuc hot',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/findNewsDetail',
    handler: newsHandlers.findNewsDetail,
    config: {
      description: 'Lay danh sach tintuc',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/findRootCategory',
    handler: newsHandlers.findRootCategory,
    config: {
      description: 'get list of root category',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/user/updateDevice',
    handler: userHandlers.updateDevice,
    config: {
      description: 'Cap nhat thong tin device: se su dung cho Push Notification',
      tags: ['api'],
      validate: {
        payload: {
          deviceID: Joi.string().required(),
          deviceModel: Joi.string().required(),
          tokenID: Joi.string(),
          tokenOs: Joi.string(),
          phone : Joi.string(),
          email : Joi.string(),
          userID : Joi.string()
        }
      },

      response: {
        schema: Joi.object({
          status: Joi.number(),
          res: Joi.object(),
          msg: Joi.string()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/profile',
    handler: loginHandler.profile,
    config : {
      description: 'Get the user information',
      tags: ['api'],
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/updateProfile',
    handler: loginHandler.updateProfile,
    config : {
      description: 'update user profile information (name,phone,email,password)',
      tags: ['api'],
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/findAdsAndDuanForHomePage',
    handler: findHandler.findAdsAndDuanForHomePage,
    config : {
      description: 'get ads duan noi bat show tren homepage',
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/api/findDuAnHotByDiaChinhForSearchPage',
    handler: findHandler.findDuAnHotByDiaChinhForSearchPage,
    config : {
      description: 'get ads duan noi bat show tren search page',
      tags: ['api']
    }
  },{
    method: 'POST',
    path: '/api/findDuAnHotByDiaChinhForDetailPage',
    handler: findHandler.findDuAnHotByDiaChinhForDetailPage,
    config : {
      description: 'get ads duan noi bat show tren detail page',
      tags: ['api']
    }
  },

  /*
  Sample "query" object:
   { loaiTin: 0,
   giaBETWEEN: [ 0, 9999999 ],
   soPhongNguGREATER: '0',
   soTangGREATER: '0',
   soPhongTamGREATER: '0',
   dienTichBETWEEN: [ 0, 9999999 ],
   place:
   { placeId: 'ChIJKQqAE44ANTERDbkQYkF-mAI',
   relandTypeName: 'Tỉnh',
   fullName: 'Hanoi',
   radiusInKm: 0.5 },
   limit: 200,
   polygon: []
   }
   */
  {
    method: 'POST',
    path: '/api/homeData4App',
    handler: homeDataHandlers.homeData4App,
    config: {
      description: 'Lay du lieu cho trang chu dua theo lan tim kiem cuoi cung. Se tra ve tat ca cac collection cho home',
      tags: ['api'],
      validate: {
        payload: {
          timeModified: Joi.number(),
          query: Joi.object(),
          currentLocation : Joi.object({
            lat : Joi.number(),
            lon : Joi.number()
          })
        }
      },

      response: {
        schema: Joi.object({
          status: Joi.number(),
          data: Joi.array().items(Joi.object({
            title1 : Joi.string(),
            title2 : Joi.string().allow(null).allow(''),
            data : Joi.array().items(Joi.object({
              adsID : Joi.string(),
              giaFmt : Joi.string(),
              dienTichFmt : Joi.string(),
              khuVuc : Joi.string(),
              soPhongNguFmt : Joi.string().allow(null),
              soPhongTamFmt : Joi.string(),
              cover : Joi.string().allow(null).allow('')
            })),
            query: Joi.object()
          })),
          lastQuery : Joi.object(),
          msg: Joi.string()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/findCategoryByParentId',
    handler: newsHandlers.findCategoryByParentId,
    config: {
      description: 'get list childs category',
      tags: ['api']
    }
  },
  {
    method: 'GET',
    path: '/api/1pay/SmsplusCharging',
    handler: onepay.smsplusCharging,
    config: {
      description: 'Nhan thong bao tu 1pay ve nap tien qua SmsPlus',
      tags: ['api'],
      /*
      validate: {
        payload: {
          access_key: Joi.string(),
          amount: Joi.string(),
          command_code : Joi.string(),
          error_code: Joi.string(),
          error_message: Joi.string(),
          mo_message: Joi.string(),
          msisdn: Joi.string(),
          request_id: Joi.string(),
          request_time: Joi.string(),
          signature: Joi.string()
        }
      },
      */
      response: {
        schema: Joi.object({
          status: Joi.number(),
          sms: Joi.string(),
          type: Joi.string()
        })
      }
    }
  },

  //no need login, bcs acctually user lost...
  {
    method: 'POST',
    path: '/api/1pay/scratchTopup',
    handler: onepay.scratchTopup,
    config: {
      description: 'Nap tien tu the cao, sẽ thực hiện lưu db, rồi goi sang onepay api',
      tags: ['api'],

       validate: {
         payload: {
           type: Joi.string().description("Loại thẻ, nhận một trong các giá trị: viettel, mobifone, vinaphone, gate, vcoin, zing (*), vnmobile (*)"),
           pin : Joi.string().description("Số pin của thẻ cào"),
           serial: Joi.string().description("Serial của thẻ cào"),
           userID : Joi.string().description("User thực hiện"),
           clientInfor : Joi.string().description("Thông tin về device: app.deviceModel, web.agent"),
           clientType : Joi.string().description("app or web"),
           startDateTime : Joi.number().description("Thời điểm call từ client")
         }
       },

      response: {
        schema: Joi.object({
          status: Joi.number().allow(null).description("mã trạng thái:0, 1..."),
          msg: Joi.string().allow(null).description("mô tả trạng thái giao dịch"),
          serial: Joi.string().allow(null).description("số serial"),
          topupAmount: Joi.number().allow(null).description("giá trị giao dịch"),
          mainAmount: Joi.number().allow(null).description("tai khoan chinh"),
          bonusAmount: Joi.number().allow(null).description("tai khoan KM"),
          totalMain: Joi.number().allow(null).description("Tổng tai khoan chinh của user"),
          totalBonus: Joi.number().allow(null).description("Tổng tai khoan KM của user"),
        })
      }
    }
  },

  //no need login, bcs acctually user lost...
  //http://localhost:5000/api/1pay/scratchDelayHandler?trans_ref=ScratchTopup_1&amount=50000&type=viettel&request_time=2015-10-02T15:43:50Z&serial=123&status=0&trans_id=456
  {
    method: 'GET',
    path: '/api/1pay/scratchDelayHandler',
    handler: onepay.scratchDelayHandler,
    config: {
      description: 'Đăng ký nhận trạng thái thẻ trễ (dành cho thẻ lỗi).',
      tags: ['api'],

      /*
      validate: {
        payload: {
          amount: Joi.string().description("Giá trị thẻ nạp"),
          type : Joi.string().description("Loại thẻ, Là 1 trong các loại thẻ: viettel, mobifone, vinaphone, gate, vcoin, zing, vnmobile"),
          request_time: Joi.string().description("Thời gian user nạp thẻ, ở dạng iso, ví dụ: 2015-10-02T15:43:50Z."),
          serial : Joi.string().description("Mã serial của thẻ"),
          status : Joi.string().description("Trạng thái xử lý, nhận giá trị: 1 – Thành công; 0 – Thất bại."),
          trans_ref : Joi.string().description("Mã của giao dịch(là trans_ref của giao dịch ở trên trang tra cứu sản lượng)."),
          trans_id : Joi.number().description("Mã giao dịch do 1pay cung cấp ở bước I.")
        }
      },
      */

      response: {
        schema: Joi.object({
          status: Joi.string().description("mã trạng thái: 00 thành công, khác 00 là lỗi"),
          msg: Joi.string().description("mô tả trạng thái giao dịch"),
        })
      }
    }
  },

  {
    method: 'POST',
    path: '/card-charging/v5/topup',
    handler: onepaySim.simScratchTopup,
    config: {
      description: 'simulate https://api.1pay.vn/card-charging/v5/topup to test scratch topup',
      tags: ['api'],

      response: {
        schema: Joi.object({
          status: Joi.string().allow(null).description("mã trạng thái:00, 01..."),
          description: Joi.string().allow(null).description("mô tả trạng thái giao dịch"),
          serial: Joi.string().allow(null).description("số serial"),
          amount: Joi.number().allow(null).description("giá trị giao dịch"),
          transRef: Joi.string().allow(null).description("mã giao dịch do merchant đăng ký"),
          transId: Joi.string().allow(null).description("mã giao dịch do 1pay cung cấp"),
        })
      }
    }
  },

  {
    method: 'POST',
    path: '/card-charging/v5/query',
    handler: onepaySim.simScratchQuery,
    config: {
      description: 'simulate https://api.1pay.vn/card-charging/v5/query to test scratch topup',
      tags: ['api'],

      response: {
        schema: Joi.object({
          status: Joi.string().allow(null).description("mã trạng thái:00, 01..."),
          description: Joi.string().allow(null).description("mô tả trạng thái giao dịch"),
          serial: Joi.string().allow(null).description("số serial"),
          amount: Joi.number().allow(null).description("giá trị giao dịch"),
          transRef: Joi.string().allow(null).description("mã giao dịch do merchant đăng ký"),
          transId: Joi.string().allow(null).description("mã giao dịch do 1pay cung cấp"),
        })
      }
    }
  },

  {
    method: 'GET',
    path: '/api/place/autocomplete',
    handler: placeHandlers.autocomplete,
    config: {
      description: 'Tra ve ds top 10 tinh/huyen/xa thoa man',
      tags: ['api'],

      /*
       validate: {
       payload: {
       amount: Joi.string().description("Giá trị thẻ nạp"),
       type : Joi.string().description("Loại thẻ, Là 1 trong các loại thẻ: viettel, mobifone, vinaphone, gate, vcoin, zing, vnmobile"),
       request_time: Joi.string().description("Thời gian user nạp thẻ, ở dạng iso, ví dụ: 2015-10-02T15:43:50Z."),
       serial : Joi.string().description("Mã serial của thẻ"),
       status : Joi.string().description("Trạng thái xử lý, nhận giá trị: 1 – Thành công; 0 – Thất bại."),
       trans_ref : Joi.string().description("Mã của giao dịch(là trans_ref của giao dịch ở trên trang tra cứu sản lượng)."),
       trans_id : Joi.number().description("Mã giao dịch do 1pay cung cấp ở bước I.")
       }
       },
       */

      response: {
        schema: Joi.object({
          predictions: Joi.array().description("ds thoa man"),
          status: Joi.string().description("mô tả trạng thái OK/ERROR"),
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/place/getPlaceByID',
    handler: placeHandlers.getPlaceByID,
    config: {
      description: 'Tra ve place by ID',
      tags: ['api'],
      response: {
        schema: Joi.object({
          place: Joi.object().description("ds thoa man"),
          status: Joi.string().description("mô tả trạng thái OK/ERROR"),
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/place/getPlaceByDiaChinhKhongDau',
    handler: placeHandlers.getPlaceByDiaChinhKhongDau,
    config: {
      description: 'Tra ve dia chinh/du an by dia chinh khong dau',
      tags: ['api'],
      validate: {
        payload: {
          tinhKhongDau: Joi.string().description("Tên tỉnh không dấu"),
          huyenKhongDau : Joi.string().description("Tên huyện không dấu"),
          xaKhongDau: Joi.string().description("Tên xã không dấu"),
          placeType : Joi.string().description("Loại địa chính T/H/Xß")
        }
      },
      response: {
        schema: Joi.object({
          diaChinh: Joi.object().description("dia chinh thoa man"),
          duAn: Joi.array().description("ds du an thuoc dia chinh cap Quan/Huyen"),
          status: Joi.string().description("mô tả trạng thái OK/ERROR"),
        })
      }
    }
  },  


  {
    method: 'POST',
    path: '/api/v2/find',
    handler: findHandlerV2.find,
    config: {
      description: 'Lay danh sach cac bai dang thoa man tieu chi tim kiem',
      tags: ['api'],
      notes: 'Nhieu loai tim kiem khac nhau, ho tro phan trang',
      validate: {
        payload: {
          loaiTin: Joi.number().integer().min(0).max(1).required()
            .description('0=BAN, 1 = THUE'),
          loaiNhaDat: Joi.array().items(Joi.number()) 
            .description('1,2,... (tham khao trong https://github.com/reway/bds/blob/master/src/assets/DanhMuc.js)'),
          giaBETWEEN: Joi.array().items(Joi.number()).length(2)
            .description('don vi la` TRIEU (voi THUE la trieu/thang)'),
          dienTichBETWEEN: Joi.array().items(Joi.number()).length(2)
            .description('don vi la` m2'),
          ngayDangTinGREATER: Joi.number().integer()
            .description('So ngay da dang'),
          soPhongNguGREATER: Joi.number().integer(),
          soPhongTamGREATER: Joi.number().integer(),
          soTangGREATER: Joi.number().integer(),
          soTang: Joi.number().integer(),
          huongNha: Joi.array().items(Joi.number())
            .description('tham khao trong https://github.com/reway/bds/blob/master/src/assets/DanhMuc.js'),
          viewport: Joi.object({
            southwest : PointModel,
            northeast : PointModel
          }).description('Khung nhin tren MAP'),
          polygon: Joi.array().items(PointModel)
            .description('Tim kiem theo polygon tren MAP: [{lat, lon}, {}]'),
          circle : {
            center : PointModel,
            radius : Joi.number()
          },
          diaChinh : {
            fullName: Joi.string(),
            tinhKhongDau : Joi.string(),
            huyenKhongDau : Joi.string(),
            xaKhongDau : Joi.string(),
            duAnKhongDau : Joi.string(),
          },
          limit: Joi.number(),
          orderBy: Joi.object({
            name : Joi.string(), // ngayDangTin
            type : Joi.string()  // ASC, DESC
          })
            .description('ngayDangTin/gia/gia/dienTich, soPhongTam, soPhongNgu'),
          pageNo: Joi.number(),
          isIncludeCountInResponse : Joi.boolean(),
          userID : Joi.string().description("to keep track history - last search"),
          soPhongNgu: Joi.number().integer(),
          soPhongTam: Joi.number().integer(),
          updateLastSearch: Joi.boolean(), 
          gia : Joi.number().integer().description("-1=thoa thuan"),
          dienTich : Joi.number().integer().description("-1=khong xac dinh"),
        }
      },
      response: {
        schema: {
          length: Joi.number().integer(),
          list: Joi.array().items(ListResultModel),
          totalCount : Joi.number().integer().allow(null),
          errMsg : Joi.string()
        }
      }
    }
  },

  {
    method: 'POST',
    path: '/api/v2/count',
    handler: findHandlerV2.count,
    config: {
      description: 'count ads',
      tags: ['api'],
      response: {
        schema: Joi.object({
          countResult : Joi.number().integer(),
        })
      }
    }
  },

  {
    method: 'POST',
    path: '/api/v2/homeData4App',
    handler: homeDataHandlersV2.homeData4App,
    config: {
      description: 'Lay du lieu cho trang chu dua theo lan tim kiem cuoi cung. Se tra ve tat ca cac collection cho home',
      tags: ['api'],
      validate: {
        payload: {
          timeModified: Joi.number(),
          query: Joi.object(),
          currentLocation : Joi.object({
            lat : Joi.number(),
            lon : Joi.number()
          })
        }
      },

      response: {
        schema: Joi.object({
          status: Joi.number(),
          data: Joi.array().items(Joi.object({
            title1 : Joi.string(),
            title2 : Joi.string().allow(null).allow(''),
            data : Joi.array().items(Joi.object({
              adsID : Joi.string(),
              loaiTin : Joi.number(),
              loaiNhaDat : Joi.number(),
              giaFmt : Joi.string(),
              dienTichFmt : Joi.string(),
              khuVuc : Joi.string(),
              soPhongNguFmt : Joi.string().allow(null),
              soPhongTamFmt : Joi.string(),
              cover : Joi.string().allow(null).allow('')
            })),
            query: Joi.object()
          })),
          lastQuery : Joi.object(),
          msg: Joi.string()
        })
      }
    }
  },
];

module.exports = internals;