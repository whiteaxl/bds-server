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

danhMuc.khoangDienTich = [
    {
        value: {
            min:  0,
            max:  30,
            id: 1     
        },
        label: "<= 30m2",
        position: 2
    },
    {
        value: {
            min:  30,
            max:  50,
            id: 2     
        },
        label: "30 - 50m2",
        position: 3
    },
    {
        value: {
            min:  50,
            max:  50,
            id: 3     
        },
        label: "50 - 80m2",
        position: 4
    },
    {
        value: {
            min:  80,
            max:  100,
            id: 4     
        },
        label: "80 - 100m2",
        position: 4
    },
    {
        value: {
            min:  100,
            max:  150,
            id: 5     
        },
        label: "100 - 150m2",
        position: 5
    },
    {
        value: {
            min:  150,
            max:  200,
            id: 6     
        },
        label: "150 - 200m2",
        position: 6
    },
    {
        value: {
            min:  200,
            max:  250,
            id: 7     
        },
        label: "200 - 250m2",
        position: 7
    },
    {
        value: {
            min:  250,
            max:  300,
            id: 8     
        },
        label: "250 - 300m2",
        position: 8
    },
    {
        value: {
            min:  300,
            max:  500,
            id: 9     
        },
        label: "300 - 500m2",
        position: 9
    },
    {
        value: {
            min:  500,
            max:  999999999999999,
            id: 10     
        },
        label: ">= 500m2",
        position: 10
    },
    {
        value: {
            min:  0,
            max:  999999999999999,
            id: 11     
        },
        label: "Diện tích bất kỳ",
        position: 11
    }
];
danhMuc.khoangGia = [
    {
        value: {
            min:  0,
            max:  500,
            id:1     
        },
        label: "<= 500 triệu",
        position: 2
    },
    {
        value: {
            min:  500,
            max:  800,
            id:2
        },
        label: "500 - 800 triệu",
        position: 3
    },
    {
        value: {
            min:  800,
            max:  1000,
            id:3
        },
        label: "800 triệu - 1 tỷ",
        position: 4
    },
    {
        value: {
            min:  1000,
            max:  2000,
            id:4     
        },
        label: "1 - 2 tỷ",
        position: 5
    },
    {
        value: {
            min:  2000,
            max:  3000,
            id:5     
        },
        label: "2 - 3 tỷ",
        position: 6
    },
    {
        value: {
            min:  3000,
            max:  5000,
            id:6     
        },
        label: "3 - 5 tỷ",
        position: 7
    },
    {
        value: {
            min:  5000,
            max:  7000,
            id:7     
        },
        label: "5 - 7 tỷ",
        position: 8
    },
    {
        value: {
            min:  7000,
            max:  10000,
            id:8     
        },
        label: "7 - 10 tỷ",
        position: 9
    },
    {
        value: {
            min:  10000,
            max:  20000,
            id:9     
        },
        label: "10 - 20 tỷ",
        position: 10
    },
    {
        value: {
            min:  20000,
            max:  30000,
            id:10     
        },
        label: "20 - 30 tỷ",
        position: 11
    },
    {
        value: {
            min:  30000,
            max:  999999999999,
            id:11    
        },
        label: ">= 30 tỷ",
        position: 12
    },
    {
        value: {
            min:  0,
            max:  999999999999,
            id:12    
        },
        label: "Giá bất kỳ",
        position: 13
    }


];

danhMuc.khoangGiaThue = [
    {
        value: {
            min:  0,
            max:  1,
            id:1     
        },
        label: "<= 1 triệu",
        position: 2
    },
    {
        value: {
            min:  1,
            max:  3,
            id:2
        },
        label: "1 - 3 triệu",
        position: 3
    },
    {
        value: {
            min:  3,
            max:  5,
            id:3
        },
        label: "3 - 5 triệu",
        position: 4
    },
    {
        value: {
            min:  5,
            max:  10,
            id:4     
        },
        label: "5 - 10 triệu",
        position: 5
    },
    {
        value: {
            min:  10,
            max:  40,
            id:5     
        },
        label: "10 - 40 triệu",
        position: 6
    },
    {
        value: {
            min:  40,
            max:  70,
            id:6     
        },
        label: "40 - 70 triệu",
        position: 7
    },
    {
        value: {
            min:  70,
            max:  100,
            id:7     
        },
        label: "70 - 100 triệu",
        position: 8
    },
    {
        value: {
            min:  100,
            max:  999999999999,
            id:8     
        },
        label: "> 100 triệu",
        position: 9
    },
    {
        value: {
            min:  0,
            max:  999999999999,
            id:9    
        },
        label: "Giá bất kỳ",
        position: 10
    }


];

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

danhMuc.LoaiTinTuc = [
    { value: "1", lable: "Tin thị trường" },
    { value: "2", lable: "Phân tích - Nhận định" },
    { value: "3", lable: "Chính sách - Quản lý" },
    { value: "4", lable: "Thông tin quy hoạch" },
    { value: "6", lable: "BĐS thế giới" },
    { value: "7", lable: "Tài chính - Chứng khoán - BĐS" },
    { value: "5", lable: "Tư vấn luật" },
    { value: "8", lable: "Lời khuyên" }
];

danhMuc.LoaiNhaDatBan = {
    1  : "Bán căn hộ chung cư",
    2  : "Bán nhà riêng",
    3  : "Bán biệt thự, liền kề",
    4  : "Bán nhà mặt phố",
    5  : "Bán đất nền dự án",
    6  : "Bán đất",
    7  : "Bán trang trại, khu nghỉ dưỡng",
    8  : "Bán kho, nhà xưởng",
    99 : "Bán loại bất động sản khác",
    10 : "Tìm kiếm nâng cao",
    0 : "Tất cả"
}


danhMuc.menu = [
    {
        label: "BĐS bán",
        value: {loaiTin: "0", loaiNhaDat: "0"},
        level: "1",
        visible: true,
        items: [
            { visible: true,value: {loaiTin: "0", loaiNhaDat: "1"}, label: "Bán căn hộ chung cư" },
            { visible: true,value: {loaiTin: "0", loaiNhaDat: "2"}, label: "Bán nhà riêng" },
            { visible: true,value: {loaiTin: "0", loaiNhaDat: "3"}, label: "Bán nhà mặt phố" },
            { visible: true,value: {loaiTin: "0", loaiNhaDat: "4"}, label: "Bán biệt thự, liền kề" },
            { visible: true,value: {loaiTin: "0", loaiNhaDat: "6"}, label: "Bán Shophouse" },
            { visible: true,value: {loaiTin: "0", loaiNhaDat: "7"}, label: "Bán đất nền dự án" },
            { visible: true,value: {loaiTin: "0", loaiNhaDat: "5"}, label: "Bán đất" },
            { visible: true,value: {loaiTin: "0", loaiNhaDat: "8"}, label: "Bán trang trại, khu nghỉ dưỡng" },
            { visible: true,value: {loaiTin: "0", loaiNhaDat: "99"}, label: "Bán các BDS khác" },
            { visible: true,value: {loaiTin: "0", loaiNhaDat: "10"}, label: "Tìm kiếm nâng cao" },
            { visible: true,value: {loaiTin: "0", loaiNhaDat: "0"}, label: "Tất cả" }
        ]                                           
    },
    {
        label: "BĐS cho thuê",
        value: {loaiTin: "1", loaiNhaDat: "0"},
        level: "1",
        visible: true,
        items: [
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "1"}, label: "Mua căn hộ chung cư" },
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "2"}, label: "Mua nhà riêng" },
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "3"}, label: "Mua biệt thự, liền kề" },
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "4"}, label: "Mua nhà mặt phố" },
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "5"}, label: "Mua đất nền dự án" },
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "6"}, label: "Mua đất" },
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "7"}, label: "Mua trang trại, khu nghỉ dưỡng" },
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "8"}, label: "Bán trang trại, khu nghỉ dưỡng" },
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "9"}, label: "Mua kho, nhà xưởng" },
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "10"}, label: "Mua loại BĐS khác" },
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "11"}, label: "Tìm kiếm nâng cao" },
            { visible: true,value: {loaiTin: "1", loaiNhaDat: "0"}, label: "Tất cả" }
        ]                                           
    },
    {
        label: "Giới thiệu",
        value: {},
        visible: true,
        items: [
            { value: {}, label: "Môi giới" },
            { value: {}, label: "Ứng dụng Mobile" }
        ]
    }
];



danhMuc.LoaiNhaDatBanWeb = [
    { value: "0", lable: "Bất kỳ" },
    { value: "1", lable: "Bán căn hộ chung cư" },
    { value: "2", lable: "Bán nhà riêng" },
    { value: "3", lable: "Bán biệt thự, liền kề" },
    { value: "4", lable: "Bán nhà mặt phố" },
    { value: "5", lable: "Bán đất nền dự án" },
    { value: "6", lable: "Bán đất" },
    { value: "7", lable: "Bán trang trại, khu nghỉ dưỡng" },
    { value: "8", lable: "Bán kho, nhà xưởng" },
    { value: "99", lable: "Bán loại bất động sản khác" }
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
    4 : "Cho Thuê nhà trọ, phòng trọ",
    5 : "Cho Thuê văn phòng",
    6 : "Cho Thuê cửa hàng, ki-ốt",
    7 : "Cho Thuê kho, nhà xưởng, đất",
    99: "Cho Thuê loại bất động sản khác",
    8 : "Tìm kiếm nâng cao",
    0 : "Tất cả"
}

danhMuc.LoaiNhaDatThueWeb = [
    { value: "0", lable: "Bất kỳ" },
    { value: "1", lable: "Cho Thuê căn hộ chung cư" },
    { value: "2", lable: "Cho Thuê nhà riêng" },
    { value: "3", lable: "Cho Thuê nhà mặt phố" },
    { value: "6", lable: "Cho thuê nhà trọ, phòng trọ" },
    { value: "4", lable: "Cho Thuê văn phòng" },
    { value: "5", lable: "Cho Thuê cửa hàng, ki-ốt" },
    { value: "7", lable: "Cho thuê kho, nhà xưởng, đất" },    
    { value: "99", lable: "Cho Thuê loại bất động sản khác" }    
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
    0.5: "0.5km",
    1: "1km",
    2: "2km",
    3: "3km",
    4: "4km",
    5: "5km"
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

danhMuc.getLoaiNhaDatForDisplayNew = function(loaiTin, loaiNhaDatKey){
    var value = '';
    if (loaiTin == '0')
        value = danhMuc.LoaiNhaDatBan[loaiNhaDatKey];

    if (loaiTin == '1')
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
    return "Hướng " + eval('danhMuc.HuongNha['+val + ']');
}


module.exports = danhMuc;

if (typeof(window) !== 'undefined')
   window.RewayListValue = danhMuc;


//import {LoaiNhaDatBan} from "danhMuc"...