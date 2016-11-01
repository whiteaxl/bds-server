var internals = {};
internals.STS = {
    SUCCESS : 0,
    FAILURE : 1
};

internals.CHAT_MESSAGE_TYPE ={
  TEXT: 1,
  IMAGE:2,
  FILE: 3,
  SYSTEM: 4
};

internals.MSG = {
    DIA_DIEM_NOTFOUND : "Địa điểm bạn tìm kiếm không tồn tại!",
    USER_EXISTS : "Người sử dụng đã tồn tại!",
    LOGIN_REQUIRED: "Đăng nhập để sử dụng tính năng này",
    USER_OFFLINE: "Tin nhắn được gửi đi trong chế độ offline",
    EXIST_SAVE_SEARCH: "Điều kiện tìm kiếm này đã được lưu",
    SUCCESS_SAVE_SEARCH: "Điều kiện tìm kiếm được lưu thành công",
    SUCCESS_LIKE_ADS: "Đã like bất động sản thành công",
    SUCCESS_UNLIKE_ADS: "Đã unlike bất động sản thành công",
    EXIST_LIKE_ADS: "Bất động sản đã được like từ trước",
    PASSWORD_NOT_CORRECT: "Mật khẩu không đúng",
    USER_NOT_EXIST: "User không tồn tại",
    SUCCESS_UPDATE_PASSWORD: "Cập nhật mật khẩu thành công",
    SUCCESS_DELETE_ADS: "Xóa thành công tin đăng"

};

internals.DB_ERR = {
	USER_EXISTS: {
		code: 101,
		message: "Người sử dụng đã tồn tại"
	}
};

internals.FORMAT = {
  DATE_IN_DB : 'YYYYMMDD',
  DATE_IN_GUI : 'DD/MM/YYYY'
};

internals.DB_SEQ = {
  ScratchTopup: "idGeneratorForScratchTopup",
  User : "idGeneratorForUsers",
  Ads  : "idGeneratorForAds"
};

internals.ADS_ID_PREFIX = {
    REWAY: "Ads_00",
    BATDONGSAN: "Ads_01",
    DOTHI: "Ads_02"
}

internals.ADS_SOURCE = {
    REWAY: "reway",
    BATDONGSAN: "bds",
    DOTHI: "dothi"
}

internals.DATA_TYPE = {
    ADS: "Ads",
    USER: "User",
    PLACE: "Place",
    DEVICE: "Device",
    CHAT: "Chat"
}

internals.TOPUP_STAGE = {
  INIT : -1,
  SUCCESS : 0,
  FAIL : 1
};

//topup type
internals.PAYMENT = {
  SCRATCH : "scratch",
  SMSPLUS : "smsplus",
  IN_APP_PURCHASE : "inAppPurchase",
  MANUAL_BANK_TRANSFER : "manualBankTransfer"
};

if (typeof(window) !== 'undefined')
   window.RewayConst = internals;
module.exports  = internals;