var internals = {};
internals.STS = {
    SUCCESS : 0,
    FAILURE : 1
};

internals.MSG = {
    DIA_DIEM_NOTFOUND : "Địa điểm bạn tìm kiếm không tồn tại!",
    USER_EXISTS : "Người sử dụng đã tồn tại!"
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


module.exports  = internals;