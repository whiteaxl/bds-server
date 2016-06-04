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
    USER_OFFLINE: "Tin nhắn được gửi đi trong chế độ offline"
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