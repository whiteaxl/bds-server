var danhMuc = {};

var BAT_KY = "Bất kỳ";

danhMuc.BAT_KY = BAT_KY;
danhMuc.BIG =9999999;

danhMuc.sellStepValues = [0, 1000, 2000, 3000, 5000, 7000, 10000, 20000, 30000]; //trieu

danhMuc.filter_max_value = {
    lable: "Bất kỳ",
    value: 999999999999999999,
}

danhMuc.sortHouseOptions = [
    {
        lable: "Giá từ cao đến thấp",
        value: "giaDESC",
        position: 1
    },
    {
        lable: "Giá từ thấp đến cao",
        value: "giaASC",
        position: 2
    },
    {
        lable: "Diện tích từ cao đến thấp",
        value: "dienTichDESC",
        position: 3
    },
    {
        lable: "Diện tích từ thấp đến cao",
        value: "dienTichASC",
        position: 4
    }
];

danhMuc.sell_steps = [
    {
        value: 1000,
        lable: "1 tỷ",
        position: 1
    },
    {
        value: 2000,
        lable: "2 tỷ",
        position: 2
    },
    {
        value: 3000,
        lable: "3 tỷ",
        position: 3
    },
    {
        value: 5000,
        lable: "5 tỷ",
        position: 4
    },
    {
        value: 7000,
        lable: "7 tỷ",
        position: 5
    },
    {
        value: 10000,
        lable: "10 tỷ",
        position: 6
    },
    {
        value: 20000,
        lable: "20 tỷ",
        position: 7
    },
    {
        value: 30000,
        lable: "30 tỷ",
        position: 8
    }
];



danhMuc.rentStepValues = [0, 2, 5, 10, 20, 50, 100, 500]; //by month

danhMuc.dienTichStepValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 400, 500];

danhMuc.convertDienTichStepValueToNameValueArray= function(){
    var result = [];
    for(var i =1; i<danhMuc.dienTichStepValues.length;i++){
        result.push({
            value: danhMuc.dienTichStepValues[i],
            lable: danhMuc.dienTichStepValues[i] + " m2",
            position: i
        });
    }
    return result;
}

danhMuc.dientich_steps = danhMuc.convertDienTichStepValueToNameValueArray();

danhMuc.LoaiTin = {
    0 : "Bán",
    1  : "Cho Thuê"
};

danhMuc.LoaiNhaDatBan = {
    1  : "Bán căn hộ chung cư",
    2  : "Bán nhà riêng",
    3  : "Bán nhà mặt phố",
    4  : "Bán biệt thự, liền kề",
    6  : "Bán Shophouse",
    7  : "Bán đất nền dự án",
    5  : "Bán đất",
    8  : "Bán trang trại, khu nghỉ dưỡng",
    99 : "Bán các BDS khác",
    10 : "Tìm kiếm nâng cao",
    0 : "Tất cả"
}

danhMuc.LoaiNhaDatBanWeb = [
    { value: "1", lable: "Bán căn hộ chung cư" },
    { value: "2", lable: "Bán nhà riêng" },
    { value: "3", lable: "Bán nhà mặt phố" },
    { value: "4", lable: "Bán biệt thự, liền kề" },
    { value: "6", lable: "Bán Shophouse" },
    { value: "7", lable: "Bán đất nền dự án" },
    { value: "5", lable: "Bán đất" },
    { value: "8", lable: "Bán trang trại, khu nghỉ dưỡng" },
    { value: "99", lable: "Bán các BDS khác" },
    { value: "10", lable: "Tìm kiếm nâng cao" },
    { value: "0", lable: "Tất cả" }
    ];

danhMuc.LoaiNhaDatCanMuaWeb = [
    { value: "1", lable: "Mua căn hộ chung cư" },
    { value: "2", lable: "Mua nhà riêng" },
    { value: "3", lable: "Mua biệt thự, liền kề" },
    { value: "4", lable: "Mua nhà mặt phố" },
    { value: "5", lable: "Mua đất nền dự án" },
    { value: "6", lable: "Mua đất" },
    { value: "7", lable: "Mua trang trại, khu nghỉ dưỡng" },
    { value: "8", lable: "Bán trang trại, khu nghỉ dưỡng" },
    { value: "9", lable: "Mua kho, nhà xưởng" },
    { value: "10", lable: "Mua loại BĐS khác" },
    { value: "11", lable: "Tìm kiếm nâng cao" },
    { value: "0", lable: "Tất cả" }
];

danhMuc.LoaiNhaDatCanThueWeb = [
    { value: "1", lable: "Cần thuê căn hộ chung cư" },
    { value: "2", lable: "Cần thuê nhà riêng" },
    { value: "3", lable: "Cần thuê nhà mặt phố" },
    { value: "4", lable: "Cần thuê nhà trọ, phòng trọ" },
    { value: "5", lable: "Cần thuê văn phòng" },
    { value: "6", lable: "Cần thuê cửa hàng, ki ốt" },
    { value: "7", lable: "Cần thuê kho, nhà xưởng, đất" },
    { value: "8", lable: "Cần thuê loại BĐS khác" },
    { value: "11", lable: "Tìm kiếm nâng cao" },
    { value: "0", lable: "Tất cả" }
];

danhMuc.LoaiNhaDatThue = {
    1 : "Cho Thuê căn hộ chung cư",
    2 : "Cho Thuê nhà riêng",
    3 : "Cho Thuê nhà mặt phố",
    6 : "Cho thuê nhà trọ, phòng trọ",
    4 : "Cho Thuê văn phòng",
    5 : "Cho Thuê cửa hàng, ki-ốt",
    7 : "Cho thuê kho, nhà xưởng, đất",
    99: "Cho Thuê các BDS khác",
    8 : "Tìm kiếm nâng cao",
    0 : "Tất cả"
}

danhMuc.LoaiNhaDatThueWeb = [
    { value: "1", lable: "Cho Thuê căn hộ chung cư" },
    { value: "2", lable: "Cho Thuê nhà riêng" },
    { value: "3", lable: "Cho Thuê nhà mặt phố" },
    { value: "6", lable: "Cho thuê nhà trọ, phòng trọ" },
    { value: "4", lable: "Cho Thuê văn phòng" },
    { value: "5", lable: "Cho Thuê cửa hàng, ki-ốt" },
    { value: "7", lable: "Cho thuê kho, nhà xưởng, đất" },
    { value: "99", lable: "Cho Thuê các BDS khác" },
    { value: "8", lable: "Tìm kiếm nâng cao" },
    { value: "0", lable: "Tất cả" }
];

danhMuc.SoPhongNgu = {
    0: BAT_KY,
    1: "1+",
    2: "2+",
    3: "3+",
    4: "4+",
    5: "5+"
}

danhMuc.SoTang = {
    0: BAT_KY,
    1: "1+",
    2: "2+",
    3: "3+",
    4: "4+",
    5: "5+"
}

danhMuc.SoPhongTam = {
    0: BAT_KY,
    1: "1+",
    2: "2+",
    3: "3+",
    4: "4+",
    5: "5+"
}

danhMuc.RadiusInKm = {
    0.5: "0.5",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5"
}

danhMuc.RadiusInKmKey = [
    0.5,
    1,
    2,
    3,
    4,
    5
]

danhMuc.NgayDaDang = {
    0: BAT_KY,
    1: "1",
    7: "7",
    14: "14",
    30: "30",
    90: "90"
}

danhMuc.NgayDaDangKey = [
    0,
    1,
    7,
    14,
    30,
    90
]

danhMuc.HuongNha = {
    0: BAT_KY,
    1: "Đông",
    2: "Tây",
    3: "Nam",
    4: "Bắc",
    5: "Đông-Bắc",
    6: "Tây-Bắc",
    7: "Đông-Nam",
    8: "Tây-Nam"
}


danhMuc.getDanhMucKeys = function (hashDanhMuc) {
    var result = [];
    for (var k in hashDanhMuc) {
        result.push(k);
    }
    return result;
}

danhMuc.getNameValueArray = function(hashDanhMuc){
    console.log("getNameValueArray");
    console.log(hashDanhMuc);
    var result = [];
    //var keys = danhMuc.getDanhMucKeys(hashDanhMuc);
    for (var k in hashDanhMuc) {
        result.push(
            {
                value: k,
                lable: hashDanhMuc[k]
            }
        )
    }
    console.log(result);
    return result;
}

danhMuc.getDanhMucValues = function (hashDanhMuc) {
    var result = [];
    for (var k in hashDanhMuc) {
        result.push(hashDanhMuc[k]);
    }
    return result;
}

danhMuc.getLoaiNhaDatBanValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.LoaiNhaDatBan);
}

danhMuc.getLoaiNhaDatThueValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.LoaiNhaDatThue);
}

danhMuc.getSoPhongNguValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.SoPhongNgu);
}

danhMuc.getSoTangValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.SoTang);
}

danhMuc.getSoPhongTamValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.SoPhongTam);
}

danhMuc.getHuongNhaValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.HuongNha);
}

danhMuc.getRadiusInKmValues = function () {
    return ["0.5", "1", "2", "3", "4", "5"];
}

danhMuc.getNgayDaDangValues = function () {
    return danhMuc.NgayDaDangKey;
}

danhMuc.getLoaiNhaDatForDisplay = function(loaiTin, loaiNhaDatKey){
    var value = '';
    if (loaiTin == 'ban')
        value = danhMuc.LoaiNhaDatBan[loaiNhaDatKey];

    if (loaiTin == 'thue')
        value = danhMuc.LoaiNhaDatThue[loaiNhaDatKey];

    if (!value)
        value = BAT_KY;

    return value;
}

danhMuc.getDanhMucKeyByIndex = function (hashDanhMuc, index) {
    var find = '';
    var i = 0;
    for (var k in hashDanhMuc) {
        if (i == index) {
            find = k;
            break;
        }
        i++;
    }
    return find;
}

danhMuc.getSoPhongByIndex = function (index) {
    return danhMuc.getDanhMucKeyByIndex(danhMuc.SoPhongNgu, index);
}

danhMuc.getSoTangByIndex = function (index) {
    return danhMuc.getDanhMucKeyByIndex(danhMuc.SoTang, index);
}

danhMuc.getSoPhongTamByIndex = function (index) {
    return danhMuc.getDanhMucKeyByIndex(danhMuc.SoPhongTam, index);
}

danhMuc.getRadiusInKmByIndex = function(index) {
    return danhMuc.RadiusInKmKey[index];
}

danhMuc.getHuongNhaDisplay = function(val){
    if (!val) {
        return "Không rõ";
    }
    return eval('danhMuc.HuongNha['+val + ']');
}

module.exports = danhMuc;

if (typeof(window) !== 'undefined')
   window.RewayListValue = danhMuc;


//import {LoaiNhaDatBan} from "danhMuc"...