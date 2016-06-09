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
    EXIST_LIKE_ADS: "Bất động sản đã được like từ trước"
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

if (typeof(window) !== 'undefined')
   window.RewayConst = internals;
module.exports  = internals;