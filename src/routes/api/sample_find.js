//request theo goxBox:

var request = {
  "loaiTin": 0,
  "giaBETWEEN": [0,9999999],
  "soPhongNguGREATER": 0,
  "soTangGREATER": 0,
  "dienTichBETWEEN": [0,9999999],
  "geoBox": [ 105.8411264, 20.9910223, 105.8829904, 21.022562 ],
  "limit": 200,
  "radiusInKm": 0.5
};

//sample response
var Response =
{
  "length": 21,
  "list": [
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/15/20160415191421-6bde.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/15/20160415191421-6bde.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415191421-6bde.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415191558-43f3.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415191445-3f80.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415191456-6350.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415191528-d368.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415191746-f86b.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415191535-e0b1.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415191618-ca8c.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415191650-ba00.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415191655-5663.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415191716-89a5.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415191421-6bde.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415191558-43f3.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415191445-3f80.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415191456-6350.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415191528-d368.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415191746-f86b.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415191535-e0b1.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415191618-ca8c.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415191650-ba00.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415191655-5663.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415191716-89a5.jpg"
        ]
      },
      "adsID": "NHÀ KHU PHÂN LÔ MẶT NGÕ Ô TÔ ĐỖ PHỐ NGUYỄN AN NINH TẦNG 1 RỘNG 45M2 TẦNG 2 RỘNG 55M2 XÂY CAO CẤP",
      "dangBoi": {
        "userID": "coc.bidv@gmail.com",
        "email": "coc.bidv@gmail.com",
        "name": "Anh Bá",
        "phone": "0973678831"
      },
      "ngayDangTin": "15-04-2016",
      "gia": 3950,
      "dienTich": 55,
      "place": {
        "geo": {
          "lat": 20.9912681,
          "lon": 105.84452250000004
        },
        "diaChi": "Đường Nguyễn An Ninh, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Đường Nguyễn An Ninh"
        },
        "duAnFullName": null,
        "diaChinhFullName": "Đường Nguyễn An Ninh, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 6,
      "soPhongTam": 4,
      "soTang": 4,
      "loaiTin": 0,
      "loaiNhaDat": 2,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Nhà riêng",
      "chiTiet": "",
      "giaDisplay": "3.95 tỷ",
      "dienTichDisplay": "55 m²",
      "soNgayDaDangTin": 6
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/03/11/20160311150450-6c86.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/03/11/20160311150450-6c86.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/11/20160311150450-6c86.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/11/20160311150507-b609.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/11/20160311150549-ec3d.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/11/20160311150610-3e0d.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/11/20160311150628-8143.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/11/20160311150700-8155.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/11/20160311150737-1088.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/11/20160311150841-fa92.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/07/20160407151039-cdf9.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/07/20160407151050-09bc.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/07/20160407151054-d9f4.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/11/20160311150450-6c86.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/11/20160311150507-b609.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/11/20160311150549-ec3d.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/11/20160311150610-3e0d.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/11/20160311150628-8143.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/11/20160311150700-8155.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/11/20160311150737-1088.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/11/20160311150841-fa92.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/07/20160407151039-cdf9.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/07/20160407151050-09bc.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/07/20160407151054-d9f4.jpg"
        ]
      },
      "adsID": "NHÀ ĐẦU NGÕ THÔNG 197 HOÀNG MAI - TRƯƠNG ĐỊNH. MB 35M2*5T MỚI, SĐCC, CHẤP NHẬN TG",
      "dangBoi": {
        "userID": "Bannhahoangmai@gmail.com",
        "email": "Bannhahoangmai@gmail.com",
        "name": "Nguyễn Xuân Sơn",
        "phone": "0986117083"
      },
      "ngayDangTin": "16-04-2016",
      "gia": 2180,
      "dienTich": 35,
      "place": {
        "geo": {
          "lat": 20.9929781519399,
          "lon": 105.84967519574002
        },
        "diaChi": "Đường Hoàng Mai, Hoàng Mai, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hoàng Mai",
          "xa": "Đường Hoàng Mai"
        },
        "duAnFullName": null,
        "diaChinhFullName": "Đường Hoàng Mai, Hoàng Mai, Hà Nội"
      },
      "soPhongNgu": 5,
      "soPhongTam": 4,
      "soTang": 5,
      "loaiTin": 0,
      "loaiNhaDat": 2,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Nhà riêng",
      "chiTiet": "Chính chủ cần bán gấp nhà 2 mặt thoáng đầu ngõ thông 197 đường Hoàng Mai_ ô tô chạy thông ra Trương Định và Phố Nguyễn Đức Cảnh. Sổ đỏ 35m2, MT 4,3m, nhà 5 tầng mới, 5 phòng rộng, 4WC vip khép kín trong phòng.Nhà đẹp, nội thất cao cấp, đầy đủ tiện nghi trong nhà cửa và cầu thang gỗ Lim, sàn nhà 2, 3, 4 lát gỗ Đức, vệ sinh sen cây bệt Inax chuẩn, điều hòa, nóng lạnh đầy đủ. Thiết kế nhà đẹp, xây theo bản vẽ chi tiết, bài trí không gian siêu thoáng, đầy đủ ánh sáng và lấy gió tự nhiên, ban công rộng, nhà xây khung bê tông, móng bè ép cọc kiên cố (có clip quay từ lúc ép cọc đan sắt để kiểm tra chất lượng).Vị trí nhà đẹp, ngõ thông thoáng đi được nhiều đường vào, gần chợ, trường học, giao thông thuận lợi, ngõ trước nhà 2,5m, cách bãi đỗ ô tô 30m. Cách Bách Khoa, BV Bạch Mai, BX Giáp Bát bán kính 1km đến 1,5km, khu dân trí cao. SĐCC, giá: 2,18 tỷ_ Bao STSĐ, chấp nhận TG. Tell: Chị Yến 0988427661.\r\n        \r\n            ",
      "giaDisplay": "2.18 tỷ",
      "dienTichDisplay": "35 m²",
      "soNgayDaDangTin": 5
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/11/20160411143914-2675.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/11/20160411143914-2675.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411143914-2675.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411144531-85df.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411144510-8852.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411144204-8d3e.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411145046-3b05.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/02/24/20160224093216-055a.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411143957-1dcf.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411144638-5666.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411144625-8159.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/02/24/20160224093300-3560.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411144014-2d72.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411144447-1341.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411144229-28fa.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/11/20160411145212-3fd6.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/02/24/20160224094027-d886.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411143914-2675.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411144531-85df.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411144510-8852.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411144204-8d3e.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411145046-3b05.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/02/24/20160224093216-055a.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411143957-1dcf.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411144638-5666.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411144625-8159.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/02/24/20160224093300-3560.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411144014-2d72.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411144447-1341.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411144229-28fa.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/11/20160411145212-3fd6.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/02/24/20160224094027-d886.jpg"
        ]
      },
      "adsID": "BÁN NHÀ NGÕ 99 ĐƯỜNG TRƯƠNG ĐỊNH, CÁCH ĐẠI HỌC KINH TẾ QUỐC DÂN 1KM, Ô TÔ GẦN NHÀ, 3 MẶT THOÁNG",
      "dangBoi": {
        "userID": "hyvongcuocsong105@yahoo.com",
        "email": "hyvongcuocsong105@yahoo.com",
        "name": "Hoàng Vũ Tiến",
        "phone": "0989084502"
      },
      "ngayDangTin": "11-04-2016",
      "gia": 2200,
      "dienTich": 31,
      "place": {
        "geo": {
          "lat": 20.9932571084587,
          "lon": 105.84955553372993
        },
        "diaChi": "Đường Trương Định, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Đường Trương Định"
        },
        "duAnFullName": null,
        "diaChinhFullName": "Đường Trương Định, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 3,
      "soPhongTam": 4,
      "soTang": 5,
      "loaiTin": 0,
      "loaiNhaDat": 2,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Nhà riêng",
      "chiTiet": "Nhà ngõ 99 phố Trương Định, cách đại học Kinh Tế Quốc Dân 1km, ô tô gần nhà, 3 mặt thoáng. Sổ đỏ 31m2, nhà xây 5 tầng mới, 5 phòng rộng, MT 4,5m, 4WC khép kín, nội thất cao cấp, đầy đủ thiết bị.- Tầng 1: Cửa vào 2 lớp, ngoài cửa sắt, trong cửa gỗ lim 4 cánh, tủ bếp gỗ sồi tự nhiên, gạch lát nền cao cấp chống xước, cầu thang lên tầng rộng rãi, khe hở rộng làm bằng mặt đá đen, cổ trắng, tay vịn kép gỗ lim, trang trí làm phòng khách cầu kỳ, khuôn tranh, trần thạch cao nẹp gỗ, đèn trùm….- Tầng 2, T3, T4 thiết kế 1 phòng rộng, vệ sinh khép kín trong phòng, không gian thoáng, bố trí hợp lý. Nền lát gỗ Đức 1,2cm chịu nước, chống xước, phòng vệ sinh rộng 4m2, đầy đủ tiện nghi, bình nóng lạnh, bếp Inax hai nút ấn, sen cây… Gạch cao cấp ốp chạm trần, có cả đèn sưởi, máy sấy tóc… Mặt tiền có ban công inox rộng.- Tầng 5 thiết kế phòng thờ, sân phơi, không gian giặt giũ.Nhà xây theo bản thiết kế, bố cục hợp lý, không gian rộng thoáng, khí vào nhà rất vượng.Kết cấu nhà vững chắc, xây trên nền đất thịt nguyên thổ, móng bè sắt dầm 8 cây phi 20, có hình ảnh ghi lại.Vị trí nhà nằm gần nhà văn hóa của phường, gần nhiều trường học các cấp, cách các trường đại học lớn như: Kinh Tế Quốc Dân, Kinh Doanh Công Nghệ, Xây Dựng, Bách Khoa, TTTM chợ Mơ..... Từ 1-2km, lối vào nhà rộng, bãi gửi ô tô cách nhà 20m. Điện, nước riêng, sổ đỏ chính chủ. Giá 2,2 tỷ (BST). Chủ nhà: Anh Tiến: 0974 459 634.\r\n        \r\n            ",
      "giaDisplay": "2.20 tỷ",
      "dienTichDisplay": "31 m²",
      "soNgayDaDangTin": 10
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/01/05/rFjRWEBN/20160105104233-35c7.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/01/05/rFjRWEBN/20160105104233-35c7.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/05/rFjRWEBN/20160105104233-35c7.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/05/rFjRWEBN/20160105104233-35c7.jpg"
        ]
      },
      "adsID": "BÁN NHÀ 4 TẦNG ĐƯỜNG HOÀNG MAI, 3 PN, 3WC, HƯỚNG TÂY, DIỆN TÍCH 35M2, GIÁ 2,199 TỶ. LH 0983741666",
      "dangBoi": {
        "userID": "Hoanganhbidv@gmail.com",
        "email": "Hoanganhbidv@gmail.com",
        "name": "Nguyễn Hoàng Anh",
        "phone": "0983741666"
      },
      "ngayDangTin": "21-03-2016",
      "gia": 2199,
      "dienTich": 35,
      "place": {
        "geo": {
          "lat": 20.992878,
          "lon": 105.85146099999997
        },
        "diaChi": "Đường Hoàng Mai, Phường Tân Mai, Hoàng Mai, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hoàng Mai",
          "xa": "Phường Tân Mai",
          "duong": "Đường Hoàng Mai"
        },
        "duAnFullName": null,
        "diaChinhFullName": "Đường Hoàng Mai, Phường Tân Mai, Hoàng Mai, Hà Nội"
      },
      "soPhongNgu": 3,
      "soPhongTam": 3,
      "soTang": 4,
      "loaiTin": 0,
      "loaiNhaDat": 2,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Nhà riêng",
      "chiTiet": "Bán nhà số 23 ngõ 47 đường Hoàng Mai. Nhà hướng Tây, diện tích 35m2, xây 4 tầng, 3PN, 3WC (diện tích xây dựng 35m2), trước nhà có sân riêng để xe khoảng 10m2, có cửa riêng biệt để được 6 xe máy. Nhà 3 mặt thoáng, an ninh tuyệt đối.Ngõ vào nhà 2.5 m, gần trường đại học KTQD, Bách Khoa, Xây dựng, bệnh viện Bạch Mai, trung tâm thương mại, bến xe Giáp Bát... Cách Hồ Gươm 4km giao thông thuận tiện.Giá bán 2,199 tỷ (có TL), để lại nội thất: Điều hòa, nóng lạnh, bàn ghế...LH Chính chủ, miễn TG, QC.Hoàng Anh, SĐT: 0983.741.666.\r\n        \r\n            ",
      "giaDisplay": "2.20 tỷ",
      "dienTichDisplay": "35 m²",
      "soNgayDaDangTin": 31
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/08/20160408081540-814c.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/08/20160408081540-814c.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081540-814c.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081540-9fff.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081540-5f6b.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081541-f52a.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081541-0fe8.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081541-7677.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081541-ff64.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081541-4b4f.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081542-85bb.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081542-9680.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081542-5d3a.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408081543-6418.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081540-814c.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081540-9fff.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081540-5f6b.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081541-f52a.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081541-0fe8.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081541-7677.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081541-ff64.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081541-4b4f.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081542-85bb.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081542-9680.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081542-5d3a.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408081543-6418.jpg"
        ]
      },
      "adsID": "PARK 10 – CĂN HỘ MASTER – VƯỜN THƯỢNG UYỂN – NƠI CỦA NGƯỜI GIÀU",
      "dangBoi": {
        "userID": "dinhtuan.dxmb@gmail.com",
        "email": "dinhtuan.dxmb@gmail.com",
        "name": "GĐVP DatxanhVinhomes",
        "phone": "0913855515"
      },
      "ngayDangTin": "08-04-2016",
      "gia": 2142,
      "dienTich": 63,
      "place": {
        "duAn": "Vinhomes Times City - Park Hill",
        "geo": {
          "lat": 20.992530266244064,
          "lon": 105.8672502040863
        },
        "diaChi": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Phường Vĩnh Tuy",
          "duong": "Đường Minh Khai"
        },
        "duAnFullName": "Vinhomes Times City - Park Hill, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Park 10 – Căn hộ Master Park Hill Premium – Nơi thể hiện đẳng cấp bậc nhất doanh nhân nhất thị trường bất động sản hiện nay tại Hà Nội.Ra đời vào giai đoạn cuối của của khu đô thị bậc nhất phía Nam Times City. Park 10 được gọi là trái tim - tâm huyết của chủ đầu tư Vingroup nhằm mang lại cho quý khách hàng sự hoàn thiện bậc nhất về phong cách sống cho khách hàng bởi các yếu tố hoàn hảo sau:- Nơi thể hiện đẳng cấp sống bậc nhất với thiết kế thông minh, sự lựa chọn linh hoạt: Khách hàng có thể lựa chọn gói bàn giao nội thất thô thỏa sức thể hiện sự sáng tạo, hoặc có thể lựa chọn gói nội thất hoàn thiện đẳng cấp hàng đầu thế giới.- Đây là tòa căn hộ có vườn thượng uyển trên cao cùng với vườn nướng BBQ phong cách Nhật Bản chỉ dành riêng cho cư dân Park 10.- Đa dạng không gian sống với nhiều lựa chọn căn hộ từ 2-5pn, diện tích thông thủy từ 63 – 168m2.- Chỉ cần đóng 30% khách hàng đã được nhận nhà và cho CĐT thuê lại luôn trong khi đó sau 4-5 tháng sau khách hàng mới đóng nốt số tiền còn lại.- Khách hàng được vay 70% với lãi suất là 0% trong 20 tháng đầu tiên.- Ngoài ra, khách hàng còn được tặng vé vui chơi, tặng giá ưu đãi gói Vinschool, Vinmec...Hiện chúng tôi đã có bảng giá chính thức, quý khách hàng quan tâm xin vui lòng liên hệ phòng kinh doanh hotline: 0914 537 841 – 0974 550 700.Tham khảo thêm tại: http://datxanhkinhdoanh.com/park-hill-premium/ Mở bán tòa cuối cùng của dự án_sản phẩm Park 10 với nhiều sự mong đợi, vị trí đẹp, hướng Bắc view toàn bộ hồ nhạc nước rộng giai đoạn 1, trường học Vinschool. Hướng Nam view toàn bộ bể bơi ngoài trời dài 80m, hướng Đông là quảng trường Park Hill giai đoạn 1, hướng Tây view nhìn ra quảng trường Park Hill Premium. Một vị trí không thể đẹp hơn.** Tòa Park 10 được thiết kế với 34 tầng, được thiết kế tối ưu phần lớn các căn hộ hai mặt thoáng. Mỗi mặt sàn có 18 căn hộ với các loại hình sau:- Căn 2 PN: Diện tích thông thủy từ: 63 m2 – 69 m2 – 73 m2 - 79 m2. Giá từ 34 đến 42 triệu/m2.- Căn hộ 3 PN: Diện tích thông thủy từ: 108 m2 – 114 m2 - 123m2. Giá từ 37 - 45 triệu/m2.- Căn hộ 4 PN: Diện tích thông thủy: 1125 m2 – 144 m2 – 147 m2. Giá từ 42 - 50 triệu/m2.- Căn hộ 5 PN: Diện tích thông thủy: 168m2. Giá từ 47 - 55 triệu/m2.Giá đã bao gồm VAT và KPBT.- Khách hàng có đa dạng sự lựa chọn:+ Trọn gói bàn giao thô: Thỏa sức sáng tạo giảm ngay 4tr/m2 với căn 4 và 5 phòng ngủ.+ Trọn gói nội thất hoàn thiện: Đầy đủ hệ thống smart Home, nội thất liền tường cao cấp.** Tiến độ thanh toán tiền làm 8 đợt: Linh hoạt.** Đặc biệt chính sách hỗ trợ ngân hàng Viettinbank, Techcombank, Vp bank.+ Hỗ trợ vay 70% không lãi suất trong 20 tháng, ân hạn gốc 24 tháng.Khách hàng hãy nhanh tay liên hệ để chọn được căn, tầng ưng ý.Hiện chúng tôi đã có bảng giá chính thức, quý khách hàng quan tâm xin vui lòng liên hệ phòng kinh doanh hotline: 0914 537 841 – 0974 550 700.Tham khảo thêm tại: Http://datxanhkinhdoanh.com/park-hill-premium/.\r\n        \r\n            ",
      "giaDisplay": "2.14 tỷ",
      "dienTichDisplay": "63 m²",
      "soNgayDaDangTin": 13
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/09/a9ejCyaw/20160409121955-39fb.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/09/a9ejCyaw/20160409121955-39fb.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/09/a9ejCyaw/20160409121955-39fb.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/09/a9ejCyaw/20160409121955-39fb.jpg"
        ]
      },
      "adsID": "MUA TIMES CITY PARK HILL ƯU ĐÃI NGAY TỪ 500 - 900 TRIỆU HĐMB",
      "dangBoi": {
        "userID": "anhvt.trongtin@gmail.com",
        "email": "anhvt.trongtin@gmail.com",
        "name": "Vũ Tuấn Anh",
        "phone": "01687414978"
      },
      "ngayDangTin": "09-04-2016",
      "gia": null,
      "dienTich": null,
      "place": {
        "duAn": "Vinhomes Times City - Park Hill",
        "geo": {
          "lat": 20.992309897966003,
          "lon": 105.86840891838074
        },
        "diaChi": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Phường Vĩnh Tuy",
          "duong": "Đường Minh Khai"
        },
        "duAnFullName": "Vinhomes Times City - Park Hill, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội"
      },
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Cơ hội cuối cùng sở hữu căn hộ đẳng cấp với chính sách hot nhất từ trước đến nay kèm theo rất nhiều ưu đãi, bao gồm Park 1, Park 2, Park 3, Park 5, Park 6, Park 7, Park 8, Park 9 và park 11 với giá ưu đãi nhất từ 28tr/m2. Hotline: 0936.454.268, 0945.6969.26.Website: http://timescity-parkhillpremium.com/ 1: Chủ đầu tư: Tập đoàn VinGroup.2: Đại lý phân phối chính thức: Công ty CPĐTPTTM Tân Thời Đại.3: Vị trí: 458 Minh Khai, Phường Vĩnh Tuy, Quận Hai Bà Trưng, Hà Nội.*** Chính sách đặc biệt tri ân khách hàng khi mua căn hộ Park Hill:• Tặng 10 năm gói dịch vụ quản lý căn hộ, quy ra tiền tương đương 1.5 triệu/m2 thông thủy.2 PN: 110 triệu3 PN : 170 triệu4 PN : 190 triệu• Nhận nhà gói bán hoàn thiện giảm 2,5 triệu/m2. (không bao gồm điều hòa, bếp, tủ bếp, tủ âm tường).2 PN khoảng : 175 triệu3 PN  khoảng: 300 triệu4 PN khoảng : 325 triệu• Khách hàng không vay, thanh toán luôn 95% tại thời điểm ký HĐMB được hưởng chiết khấu thẳng vào giá 2 PN khoảng : 240 triệu3 PN khoảng : 320 triệu4 PN khoảng : 400 triệu• Vay Vốn ngân hàng  70% lãi suất 0%/ 24 tháng. Ân hạn gốc và miễn phí phạt trả trước trong thời gian ưu đãi. Vay tối đa 20 năm.Quý khách vui lòng để lại SMS nếu số máy bận.Hotline: 0936.454.268http://timescity-parkhillpremium.com/ Địa chỉ: Sàn Giao Dịch Bất Động sản Vinhomes: 458 Minh Khai, Hai Bà Trưng, Hà Nội.\"Uy tín chính xác & làm việc trực tiếp giá bán chủ đầu tư\".\r\n        \r\n            ",
      "giaDisplay": "Thỏa thuận",
      "dienTichDisplay": "Không rõ",
      "soNgayDaDangTin": 12
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/03/28/20160328141855-72f0.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/03/28/20160328141855-72f0.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/28/20160328141855-72f0.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/28/20160328141859-8bd5.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/28/20160328141902-b3d7.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/28/20160328141905-db79.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/28/20160328141911-6439.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/28/20160328141914-bddb.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/03/28/20160328141923-cd6e.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/28/20160328141855-72f0.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/28/20160328141859-8bd5.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/28/20160328141902-b3d7.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/28/20160328141905-db79.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/28/20160328141911-6439.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/28/20160328141914-bddb.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/03/28/20160328141923-cd6e.jpg"
        ]
      },
      "adsID": "ĐỘC QUYỀN PHÂN PHỐI TÒA T10 TIMES CITY, CK 5% NHẬN NHÀ Ở NGAY, HỖ TRỢ VAY VỐN LS 0% TRONG 12TH",
      "dangBoi": {
        "userID": "thuha23489@gmail.com",
        "email": "thuha23489@gmail.com",
        "name": "Đặng Thu Hà",
        "phone": "0978858009"
      },
      "ngayDangTin": "11-04-2016",
      "gia": 2800,
      "dienTich": 81,
      "place": {
        "duAn": "Times City",
        "geo": {
          "lat": 20.994181409769684,
          "lon": 105.86843633651733
        },
        "diaChi": "Dự án Times City, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng"
        },
        "duAnFullName": "Times City, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Phân phối độc quyền căn hộ chung cư Times City tòa T10 nhận nhà ở ngay, với vị trí trung tâm đắc địa nhất, view trực tiếp nhạc nước với chính sách ưu đãi vô cùng hấp dẫn nhất đã thu hút số lượng lớn khách hàng quan tâm và đặt mua căn hộ:Hotline: 0978.858.009 - 0916.886.700.1. Tặng ngay gói tri ân hoặc trừ thẳng vào giá trị căn hộ trị giá.• Tặng 10 năm gói dịch vụ quản lý căn hộ. Trị giá 1.500.000/m2. (Nếu không nhận gói dịch vụ, trừ thẳng vào giá trị căn hộ DT 81m2 = 146 triệu, 106m2 = 190 triệu).• Tặng thẻ dịch vụ chăm sóc sức khỏe tại bệnh viện Vinmec. Trị giá: 30 triệu đồng.• Tặng gói dịch vụ giáo dục 1 năm tại trường liên cấp Vinschool. Trị giá: 35,4 triệu đồng.• Tặng 30 vé vui chơi giải trí (10 vé/năm).•Tặng gói nước nóng trị giá 20 triệu.2. Hỗ trợ gói nội thất hoặc trừ thẳng vào giá trị căn hộ.- Căn hộ DT 80m2 hỗ trợ 40 triệu/căn.- Căn hộ DT 106m2 hỗ trợ 80 triệu/căn.3. Chiết khấu 5% giá trị căn hộ.Quý khách hàng sẽ được hưởng chiết khấu 5% (giá trị căn hộ) khi thanh toán 100 % giá trị căn hộ khi không vay vốn ngân hàng Vietcombank.4. Chính sách cam kết thuê lại căn hộ từ chủ đầu tư.Chủ đầu tư cam kết thuê lại căn hộ trong 2 năm, thanh toán 1 năm/lần ngay sau khi khách hàng nhận nhà và làm hợp đồng thuê căn hộ vớ CĐT. Phù hợp với quý khách hàng có nhu cầu đầu tư cho thuê với lợi nhuận cao.• Căn 80 m2 không đồ giá 15 triệu/tháng: Giá trị: 360 triệu/24 tháng.• Căn 106 m2 không đồ giá 17 triệu/tháng: Giá trị: 408 triệu/24 tháng.5. Hỗ trợ vay vốn ngân hàng.Hỗ trợ vay vốn ngân hàng lên tới 70% giá trị căn hộ, lãi suất 0% trong 12 tháng, ân hạn nợi gốc và miễn phí phạt trả nợ trước hạn trong 12 tháng, thời gian vay vốn 15 năm.6. Giá bán căn hộ.Như vậy với các ưu đãi trên sau khi trừ các gói ưu đãi và gói cho thuê căn hộ:- Đối với căn 81m2. 2 PN.+ Tầng 5, căn số 12a, giá gốc 3,590 tỷ/ Giá bán sau ưu đãi = 2,8 tỷ. BC Nam.+ Tầng 12, căn số 5, giá 3,736 tỷ/ Giá sau ưu đãi = 2,9 tỷ. BC Nam.+ Tầng 20, căn số 12a, giá gốc 3,534 tỷ / Giá sau ưu đãi = 2,760 tỷ. BC Nam.+ Tầng 27, căn số 12, giá 3,366 tỷ / Giá sau ưu đãi = 2,6 tỷ. BC Bắc.- Đối với căn 106m2. 3 PN.+ Tầng 3, căn số 11, giá 4,284 tỷ - trừ ưu đãi = 3,3 tỷ, View sân thể thao, hồ nước, sân chơi trẻ em.+ Tầng 5, căn số 11, giá 4,588 tỷ - Trừ ưu đãi = 3,6 tỷ, view sân thể thao, sân chơi trẻ em.+ Tầng 12a, căn số 10, giá 4,428 tỷ - trừ ưu đãi = 3,5 tỷ, view nhạc nước, quảng trường.7. Tiến độ thanh toán chia làm 2 đợt:- Đặt cọc 100.000.000 triệu - ký thoản thuận đặt cọc CĐT.- Sau 7 ngày ký cọc, Thanh toán 30% và ký HĐMB.- Sau 15 -20 ngày ký HĐMB thanh toán 70% và nhận nhà.Vui lòng liên hệ để được hỗ trợ xem căn hộ và thủ tục mua bán căn hộ tòa T10 Times City.Phụ trách tòa T10 Times City:0978.858.009 - 0916.886.700.Địa chỉ: Tầng 1 Sàn BĐS Vinhomes Times City - 458 Minh Khai - Hai Bà Trưng.\r\n        \r\n            ",
      "giaDisplay": "2.80 tỷ",
      "dienTichDisplay": "81 m²",
      "soNgayDaDangTin": 10
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/09/20160409183000-116d.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/09/20160409183000-116d.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/09/20160409183000-116d.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/09/20160409183003-c120.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/09/20160409183011-eaf4.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/09/20160409183016-9aa4.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/09/20160409183144-b1e3.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/09/20160409183155-6570.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/09/20160409183204-b521.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/09/20160409183205-7aba.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/09/20160409183000-116d.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/09/20160409183003-c120.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/09/20160409183011-eaf4.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/09/20160409183016-9aa4.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/09/20160409183144-b1e3.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/09/20160409183155-6570.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/09/20160409183204-b521.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/09/20160409183205-7aba.jpg"
        ]
      },
      "adsID": "TIMESCITY T10 TÒA ĐẸP NHẤT Ở NGAY,CHIẾT KHẤU LỚN ,MPQL 10NĂM,VAY 70% LS 0%TRONG 12TH LH 0944213555",
      "dangBoi": {
        "userID": "hieudj6789@gmail.com",
        "email": "hieudj6789@gmail.com",
        "name": "Hieu Le",
        "phone": "0944213555"
      },
      "ngayDangTin": "09-04-2016",
      "gia": 2600,
      "dienTich": 81,
      "place": {
        "duAn": "Times City",
        "geo": {
          "lat": 20.9942615427222,
          "lon": 105.86852216720581
        },
        "diaChi": "Dự án Times City, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng"
        },
        "duAnFullName": "Times City, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City, Hai Bà Trưng, Hà Nội"
      },
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Ưu đãi đặc biệt giành cho các căn hộ cuối cùng của tòa T10, tùy vào sự chọn lựa của khách hàng để sở hữu riêng cho mình 1 căn hộ tại Vinhomes Times City T10.Hotline: 0967804855 – 0944213555.Ký hợp đồng trực tiếp chủ đầu tư, nhận nhà ở ngay, nhận ngay sổ đỏ.1. Đặc biệt còn duy nhất tòa T10 còn gói tri ân của chủ đầu tư.• Tặng 10 năm gói dịch vụ quản lý căn hộ. Trị giá 146 triệu căn 81m, 190 triệu căn 106m trừ thẳng vào giá trị căn hộ.• Tặng thẻ dịch vụ chăm sóc sức khỏe tại bệnh viện Vinmec (thẻ Vip dành cho 4 người). Trị giá: 30 triệu.• Tặng gói dịch vụ giáo dục 1 năm tại trường liên cấp Vinschool (gồm tiền học phí + tiền ăn). Trị giá: 35,4 triệu.• Tặng 30 vé vui chơi giải trí ở trung tâm thương mại vincom megamal(10 vé/năm).• Tặng gói 10 năm nước nóng trị giá 20 triệu.2. Hỗ trợ gói nội thất hoàn thiện .- Căn hộ DT 80m2 hỗ trợ 40 triệu/căn.- Căn hộ DT 106m2 hỗ trợ 80 triệu/căn.3. Chính sách cam kết thuê lại căn hộ từ chủ đầu tư.Chủ đầu tư cam kết thuê lại căn hộ trong 2 năm, thanh toán 1 năm/lần ngay sau khi khách hàng nhận nhà và làm hợp đồng thuê căn hộ với Chủ Đầu Tư. • Căn 80 m2 không đồ giá 15 triệu/tháng: Giá trị: 360 triệu/24 tháng.• Căn 106 m2 không đồ giá 17 triệu/tháng: Giá trị: 408 triệu/24 tháng.4. Chiết khấu 5% giá trị căn hộ.Quý khách sẽ được hưởng chiết khấu 5% (giá trị căn hộ) khi thanh toán 100 % giá trị căn hộ khi không vay vốn ngân hàng.Hỗ trợ vay vốn ngân hàng lên tới 70% giá trị căn hộ, lãi suất 0% trong 12 tháng, ân hạn trả nợ gốc và miễn phí phạt trả nợ trước hạn trong 12 tháng, thời gian vay vốn 15 năm từ ngân hàng vietcombank.Tòa T10 được đặt ở vị trí trung tâm trắc địa nhất của Times City, nằm cạnh hồ điều hòa xung quanh T10 gần trường học, bệnh viện, sân thể thao, trung tâm thương mại, rạp chiếu phim, đồi vọng cảnh...T10 được mệnh danh là tòa đẹp nhất Times City.Vui lòng liên hệ với chúng tôi để được hỗ trợ đầy đủ thông tin, bảng giá và tham quan căn hộ thực tế ngay hôm nay.Phụ trách dự án tòa T10 Times City.Mr hiếu: 0944.213.555 – 09678.04.855.Mail: lehieu.vinhomes@gmail.comĐịa chỉ: Phòng 08, tòa Tower 1, sàn BĐS Vinhomes Times City.458 Minh Khai - Hai Bà Trưng - Hà Nội.\r\n        \r\n            ",
      "giaDisplay": "2.60 tỷ",
      "dienTichDisplay": "81 m²",
      "soNgayDaDangTin": 12
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/08/20160408163709-1ca5.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/08/20160408163709-1ca5.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408163709-1ca5.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408163709-1055.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408163709-3c9d.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408163709-2f76.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408163721-9981.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408163721-99c7.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408163723-6ba8.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408163709-1ca5.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408163709-1055.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408163709-3c9d.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408163709-2f76.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408163721-9981.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408163721-99c7.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408163723-6ba8.jpg"
        ]
      },
      "adsID": "T10 TIMES CITY, CHỈ TỪ 850TR NHẬN NHÀ Ở NGAY, CAM KẾT THUÊ LẠI 15TR/THÁNG. VAY VỐN LS 0% TRONG 12TH",
      "dangBoi": {
        "userID": "buihoan19021987@gmail.com",
        "email": "buihoan19021987@gmail.com",
        "name": "bùi văn hoàn",
        "phone": "0904762626"
      },
      "ngayDangTin": "08-04-2016",
      "gia": 2849,
      "dienTich": 81.4,
      "place": {
        "duAn": "Times City",
        "geo": {
          "lat": 20.994271559338284,
          "lon": 105.8685114383702
        },
        "diaChi": "Dự án Times City, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Phường Vĩnh Tuy",
          "duong": "Đường Minh Khai"
        },
        "duAnFullName": "Times City, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 2,
      "soPhongTam": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "*** Chính sách ưu đãi lớn từ chủ đầu tư Times City: Trừ trực tiếp hơn 200 triệu ưu đãi (10 năm dịch vụ, thẻ học, thẻ khám bệnh... ) vào giá căn hộ, cam kết thuê lại lên đến 432 triệu, hỗ trợ sửa lại như nhà mẫu khoảng 40 - 80 triệu… Vẫn được chiết khấu 5% giá trị căn hộ.+ Chính thức mở bán căn hộ tòa T10 Times City... Vị trí trung tâm đẹp nhất dự án, nhìn thẳng quảng trường nhạc nước, nhận nhà ở ngay.+ Diện tích 81,4m2 – 106m2, view mặt hồ, nhận nhà ngay, chiết khấu 5%.+ Giá hiện tại là 3,357 tỷ - Nay chỉ còn 2,8 tỷ/căn 2 phòng ngủ 81,4m2 giá 35tr/m2. Đặc biệt: Được sống trong tòa T10 đẳng cấp nhất dự án Times City.- Nội thất bàn giao: Sàn gỗ, trần thạch cao, thiết bị vệ sinh, thiết bị nhà bếp, tủ âm tường, đèn, điều hòa, chuông cửa, khóa mã, vân tay.- Sổ đỏ chính chủ, bàn giao căn hộ nguyên bản- Các tiện ích xung quanh: T10 gần siêu thị, trung tâm chiếu phim, trung tâm ẩm thực, trường học, bệnh viện, bể bơi, sân thể thao, hồ nước, đồi vọng cảnh...1.Căn 80m2, 2 PN, 2 vệ sinh, 1 bếp, 1 khách, 1 ban công+ Tầng 9, căn 07, giá gốc 3,764 tỷ - Giá sau ưu đãi 3,332 tỷ - Giá sau thuê 2,972 tỷ+ Tầng 10, căn 12a, giá 3,736 tỷ - Giá sau ưu đãi 3,305 tỷ - Giá sau thuê 2,945 tỷ+ Tầng 10, căn 15, giá 3,764 tỷ - Giá sau ưu đãi 3,323 tỷ - Giá sau thuê 2,963 tỷ+ Tầng 15, căn 05, giá 3,736 tỷ - Giá sau ưu đãi 3,305 tỷ - Giá sau thuê 2,945 tỷ+ Tầng 19, căn 15, giá 3,619 tỷ - Giá sau ưu đãi 3,194 tỷ - Giá sau thuê 2,789 tỷ+ Tầng 21, căn 15, giá 3,572 tỷ - Giá sau ưu đãi 3,149 tỷ - Giá sau thuê 2,745 tỷ+ Tầng 25, căn 07, giá 3,478 tỷ - Giá sau ưu đãi 3.060 tỷ - Giá sau thuê 2,700 tỷ+ Tầng 26, căn 12a, giá 3,357 tỷ - Giá sau ưu đãi 2,945 tỷ - Giá sau thuê 2,585 tỷ2. Căn 106m2, 2 PN, 2 vệ sinh, 2 ban công, 1 bếp, 1 khách+ Tầng 6, căn 09, giá 4,649 tỷ - Giá sau ưu đãi 4,091tỷ - Giá sau thuê 3,691 tỷ+ Tầng 10, căn 11, giá 4,775 tỷ - Giá sau ưu đãi 4,210 tỷ - Giá sau thuê 3,810 tỷ+ Tầng 12a, căn 11, giá 4,406 tỷ - Giá sau ưu đãi 3,860 tỷ - Giá sau thuê 3,460 tỷ+ Tầng 19, căn 11, giá 4,676 tỷ - Giá sau ưu đãi 4,116 tỷ - Giá sau thuê 3,716 tỷ+ Tầng 22, căn 09, giá 4,500 tỷ - Giá sau ưu đãi 3,949 tỷ - Giá sau thuê 3,549 tỷ+ Tầng 25, căn 09, giá 4,354 tỷ - Giá sau ưu đãi 3,810 tỷ - Giá sau thuê 3,410 tỷ+ Tầng 26, căn 11, giá 4,284 tỷ - Giá sau ưu đãi 3,744 tỷ - Giá sau thuê 3,344 tỷ3.Tiến độ thanh toán chia làm 2 đợt:- Đặt cọc 100.000.000 triệu – ký thoản thuận đặt cọc CĐT.- Sau 7 ngày ký cọc, Thanh toán 30% và ký HĐMB.- Sau 15 -20 ngày ký HĐMB thanh toán 70% và nhận nhà.Quý khách có nhu cầu xin liên hệ:Phụ trách tòa T10: 0904 76 26 26 – 0975 015 321.Địa chỉ: 458 Minh Khai – Hai Bà Trưng – Hà Nội.Tầng 1 tòa nhà Tower 1, sàn Giao dịch Vinhomes Times City.\r\n        \r\n            ",
      "giaDisplay": "2.85 tỷ",
      "dienTichDisplay": "81.4 m²",
      "soNgayDaDangTin": 13
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/08/20160408131000-f036.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/08/20160408131000-f036.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408131000-f036.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408131003-f74c.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408131007-6c0b.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408131014-6a6b.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408131021-26ce.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408131032-4f8f.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408131041-7926.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408131047-8e95.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408131000-f036.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408131003-f74c.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408131007-6c0b.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408131014-6a6b.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408131021-26ce.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408131032-4f8f.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408131041-7926.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408131047-8e95.jpg"
        ]
      },
      "adsID": "TIMES CITY T10: CẬP NHẬT DANH SÁCH CĂN HỘ DT 80M2, GIÁ 2,6 TỶ, 106M2 GIÁ 3,344 TỶ, NHẬN NHÀ Ở NGAY",
      "dangBoi": {
        "userID": "phuongphuongwww@gmail.com",
        "email": "phuongphuongwww@gmail.com",
        "name": "pham mai phuong",
        "phone": "0988915114"
      },
      "ngayDangTin": "08-04-2016",
      "gia": 2600,
      "dienTich": 80,
      "place": {
        "duAn": "Times City",
        "geo": {
          "lat": 20.99419142639109,
          "lon": 105.86876893043518
        },
        "diaChi": "Dự án Times City, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng"
        },
        "duAnFullName": "Times City, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 2,
      "soPhongTam": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Hiện tại chủ đầu tư đang bán các căn hộ tòa T10, nhận nhà ở ngay, số lượng có hạn, giá niêm yết CĐT và hưởng đầy đủ các chính sách ưu đãi lớn như sau:Liên hệ hotline: 0915562211 – 0988915114- Nội thất bàn giao: Sàn gỗ, trần thạch cao, thiết bị vệ sinh, thiết bị nhà bếp, tủ âm tường, đèn, điều hòa, chuông cửa, khóa mã, vân tay.- Sổ đỏ chính chủ, bàn giao căn hộ nguyên bản- Các tiện ích xung quanh: T10 gần siêu thị, trung tâm chiếu phim, trung tâm ẩm thực, trường học, bệnh viện, bể bơi, sân thể thao, hồ nước, đồi vọng cảnh...1.\tCăn 80m2, 2 PN, 2 vệ sinh, 1 bếp, 1 khách, 1 ban công+ Tầng 9, căn 07, giá gốc 3,764 tỷ - Giá sau ưu đãi 3,332 tỷ - Giá sau thuê 2,972 tỷ+ Tầng 10, căn 12a, giá 3,736 tỷ - Giá sau ưu đãi 3,305 tỷ - Giá sau thuê 2,945 tỷ+ Tầng 10, căn 15, giá 3,764 tỷ - Giá sau ưu đãi 3,323 tỷ - Giá sau thuê 3,963 tỷ+ Tầng 15, căn 05, giá 3,736 tỷ - Giá sau ưu đãi 3,305 tỷ - Giá sau thuê 2,945 tỷ+ Tầng 19, căn 15, giá 3,619 tỷ - Giá sau ưu đãi 3,194 tỷ -  Giá sau thuê 2,789 tỷ+ Tầng 21, căn 15, giá 3,572 tỷ - Giá sau ưu đãi 3,149 tỷ - Giá sau thuê 2,745 tỷ+ Tầng 25, căn 15, giá 3,525 tỷ - Giá sau ưu đãi 3,105 tỷ - Giá sau thuê 2,745 tỷ+ Tầng 25, căn 07, giá 3,478 tỷ - Giá sau ưu đãi 3.060 tỷ - Giá sau thuê 2,700 tỷ+ Tầng 26, căn 12a, giá 3,357 tỷ - Giá sau ưu đãi 2,945 tỷ - Giá sau thuê 2,585 tỷ2. Căn 106m2, 2 PN, 2 vệ sinh, 2 ban công, 1 bếp, 1 khách+ Tầng 5, căn 11, giá 4,588 tỷ - Giá sau ưu đãi 4,033 tỷ- Giá sau thuê 2,945 tỷ+ Tầng 6, căn 09,  giá 4,649 tỷ - Giá sau ưu đãi 4,091tỷ - Giá sau thuê 3,691 tỷ+ Tầng 10, căn 11, giá 4,775 tỷ - Giá sau ưu đãi 4,210 tỷ - Giá sau thuê 3,810 tỷ+ Tầng 12a, căn 11, giá 4,406 tỷ - Giá sau ưu đãi 3,860 tỷ - Giá sau thuê 3,460 tỷ+ Tầng 17, căn 11, giá 4,713 tỷ - Giá sau ưu đãi 4,151 tỷ - Giá sau thuê 3,751 tỷ+ Tầng 19, căn 11, giá 4,676 tỷ - Giá sau ưu đãi 4,116 tỷ - Giá sau thuê 3,716 tỷ+ Tầng 22, căn 09, giá 4,500 tỷ - Giá sau ưu đãi 3,949 tỷ - Giá sau thuê  3,549 tỷ+ Tầng 25, căn 09, giá 4,354 tỷ - Giá sau ưu đãi 3,810 tỷ - Giá sau thuê  3,410 tỷ+ Tầng 26, căn 11, giá 4,284 tỷ - Giá sau ưu đãi 3,744 tỷ - Giá sau thuê 3,344 tỷ3.\tTiến độ thanh toán chia làm 2 đợt:- Đặt cọc 100.000.000 triệu – ký thoản thuận đặt cọc CĐT.- Sau 7 ngày ký cọc, Thanh toán 30% và ký HĐMB.- Sau 15 -20 ngày ký HĐMB thanh toán 70% và nhận nhà.Quý khách vui lòng liên hệ để được hỗ trợ xem căn hộ thực tế và làm thủ tục mua bán căn hộ tòa T10 Times City.Phụ trách dự án Vinhomes Times City.- Hoàng Linh: 0915562211- Hồng Thơm: 0988915114 - Phạm Thắng 0916667355.Địa chỉ: Tầng 1 Sàn BĐS Vinhomes Times City - 458 Minh Khai - Hai Bà Trưng.\r\n        \r\n            ",
      "giaDisplay": "2.60 tỷ",
      "dienTichDisplay": "80 m²",
      "soNgayDaDangTin": 13
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/01/20160401153142-59ee.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/01/20160401153142-59ee.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/01/20160401153142-59ee.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/01/20160401153156-6211.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/01/20160401153206-4c44.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/01/20160401153228-3e59.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/01/20160401153329-4641.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/01/20160401153336-8fba.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/01/20160401153346-ccca.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/01/20160401153357-06b3.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/01/20160401153142-59ee.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/01/20160401153156-6211.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/01/20160401153206-4c44.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/01/20160401153228-3e59.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/01/20160401153329-4641.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/01/20160401153336-8fba.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/01/20160401153346-ccca.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/01/20160401153357-06b3.jpg"
        ]
      },
      "adsID": "ƯU ĐÃI KHỦNG ĐẾN 930 TRIỆU, SỞ HỮU NGAY CH 106M2 CHỈ VỚI 3,430 TỶ TẠI TÒA T10 TRUNG TÂM - TIMESCITY",
      "dangBoi": {
        "userID": "Rosetimescity@gmail.com",
        "email": "Rosetimescity@gmail.com",
        "name": "Nguyễn Thị THu Hồng",
        "phone": "0984600099"
      },
      "ngayDangTin": "15-04-2016",
      "gia": 3430,
      "dienTich": 106,
      "place": {
        "duAn": "Times City",
        "geo": {
          "lat": 20.9942515261055,
          "lon": 105.86854362487793
        },
        "diaChi": "Dự án Times City, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng"
        },
        "duAnFullName": "Times City, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 2,
      "soPhongTam": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Times City tòa T10 với tổng giá trị ưu đãi đặc biệt lên tới 930 triệu, Quý khách sở hữu ngay căn hộ chỉ còn 3,430 tỷ bao gồm ( VAT + KPBT). Khi mua căn hộ tại tòa T10 được nhận nhà ở ngay, ký hợp đồng trực tiếp CĐT, nhận ngay sổ đỏ và sở hữu căn hộ đẹp nhất dự án Times City. Hotline: 09846 000 99 – 09 466 355 681. Tặng ngay gói tri ân hoặc trừ thẳng vào giá trị căn hộ trị giá 190 triệu• Tặng 10 năm gói dịch vụ quản lý căn hộ. Trị giá: 190 triệu• Tặng thẻ dịch vụ chăm sóc sức khỏe tại bệnh viện Vinmec (thẻ Vip dành cho 4 người). Trị giá: 30 triệu đồng.• Tặng gói dịch vụ giáo dục 1 năm tại trường liên cấp Vinschool (gồm tiền học phí + tiền ăn). Trị giá: 35,4 triệu đồng.• Tặng 30 vé vui chơi giải trí (10 vé/năm).2. Hỗ trợ gói nội thất hoặc trừ thẳng vào giá trị căn hộ                                   - Căn hộ DT 80m2 hỗ trợ 40 triệu/căn- Căn hộ DT 106m2 hỗ trợ 80 triệu/căn3. Chiết khấu 5% giá trị căn hộQuý khách hàng sẽ được hưởng chiết khấu 5% (giá trị căn hộ) khi thanh toán 100 % giá trị căn hộ khi không vay vốn ngân hàng Vietcombank và thanh toán theo đúng tiến độ .4. Chính sách cam kết thuê lại căn hộ từ Chủ đầu tưChủ đầu tư cam kết thuê lại căn hộ trong 2 năm, thanh toán 1 năm/lần ngay sau khi khách hàng nhận nhà và làm hợp đồng thuê căn hộ vớ CĐT. Phù hợp với quý khách hàng có nhu cầu đầu tư cho thuê với lợi nhuận cao.• Căn 80 m2 không đồ giá 15 triệu/tháng: Giá trị: 360 triệu/24 tháng.• Căn 106 m2 không đồ giá 17 triệu/tháng: Giá trị: 408 triệu/24 tháng.5. Hỗ trợ vay vốn ngân hàng Hỗ trợ vay vốn ngân hàng lên tới 70% giá trị căn hộ, lãi suất 0% trong 12 tháng, ân hạn nợ gốc và miễn phí phạt trả nợ trước hạn trong 12 tháng, thời gian vay vốn 15 năm.6. Diện tích căn hộ linh hoạtCăn hộ bao gồm các hướng Bắc và hướng Nam, Đông, Tây, Tây bắc, Tây Nam, Đông Bắc, Đông Nam.- Căn hộ 2 PN: DT 80m2, 90m2, 106m2.- Căn hộ 3 PN: DT 106m2, 115m27. Nhận nhà ở ngay, mật độ cư dân thấp, tiện ích đa dạngDuy nhất tại Times City khi mua căn hộ tòa T10 nhận nhà ở ngay, có mật độ cư dân thấp có 27 tầng, 18 căn hộ/sàn. Bao gồm 8 thang máy di chuyển nhanh chóng, thuận tiện. Tiện ích xung quanh T10 gần siêu thị, trung tâm chiếu phim, trung tâm ẩm thực, trường học, bệnh viện, bể bơi, sân thể thao, hồ nước, đồi vọng cảnh...Vui lòng liên hệ với chúng tôi để được hỗ trợ đầy đủ thông tin và tham quan căn hộ thực tế ngay hôm nay.\r\n        \r\n            ",
      "giaDisplay": "3.43 tỷ",
      "dienTichDisplay": "106 m²",
      "soNgayDaDangTin": 6
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/05/20160405140432-803c.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/05/20160405140432-803c.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405140432-803c.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405140439-3123.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405140459-bf59.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405140711-8972.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405140716-3197.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405140432-803c.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405140439-3123.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405140459-bf59.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405140711-8972.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405140716-3197.jpg"
        ]
      },
      "adsID": "CHÍNH CHỦ CẦN BÁN CĂN HỘ T8 - TẦNG 18 - KHU TIMES CITY - TẦNG TRUNG RẤT ĐẸP",
      "dangBoi": {
        "userID": "nghe.viet@gmail.com",
        "email": "nghe.viet@gmail.com",
        "phone": "01207410136"
      },
      "ngayDangTin": "06-04-2016",
      "gia": 3050,
      "dienTich": 83,
      "place": {
        "duAn": "Times City",
        "geo": {
          "lat": 20.994001110469263,
          "lon": 105.86951994895935
        },
        "diaChi": "Dự án Times City, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng"
        },
        "duAnFullName": "Times City, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 2,
      "soPhongTam": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Cần bán căn hộ diện tích 83m2 (thông thủy 75m2) - Khu Times City, 2 phòng ngủ, 2 vệ sinh, nội thất đầy đủ - Rất đẹp, ban công hướng Nam, tầng 18, tòa T8, vào ở ngay, sổ đỏ chính chủ. Miễn trung gian.\r\n        \r\n            ",
      "giaDisplay": "3.05 tỷ",
      "dienTichDisplay": "83 m²",
      "soNgayDaDangTin": 15
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/14/20160414110436-87e7.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/14/20160414110436-87e7.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/14/20160414110436-87e7.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/14/20160414110455-3eb6.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/14/20160414110512-c2a9.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/14/20160414110526-d940.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/14/20160414110818-909c.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/14/20160414110825-d5b4.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/14/20160414111000-dd83.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/14/20160414110436-87e7.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/14/20160414110455-3eb6.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/14/20160414110512-c2a9.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/14/20160414110526-d940.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/14/20160414110818-909c.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/14/20160414110825-d5b4.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/14/20160414111000-dd83.jpg"
        ]
      },
      "adsID": "CƠ HỘI SỞ HỮU CHCC RẺ ĐẸP 29TR/M2 TẠI VINHOMES TIMES CITY PARK HILL TRONG TAY 0902159592",
      "dangBoi": {
        "userID": "minhkhang68.trongtin@gmail.com",
        "email": "minhkhang68.trongtin@gmail.com",
        "name": "Trần Minh Khang",
        "phone": "0902159592"
      },
      "ngayDangTin": "14-04-2016",
      "gia": 1700,
      "dienTich": 47,
      "place": {
        "duAn": "Vinhomes Times City - Park Hill",
        "geo": {
          "lat": 20.994333267211914,
          "lon": 105.86756134033203
        },
        "diaChi": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Phường Vĩnh Tuy",
          "duong": "Đường Minh Khai"
        },
        "duAnFullName": "Vinhomes Times City - Park Hill, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 1,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Vinhomes luôn mong muốn đem đến cho khách hàng cuộc sống trọn vẹn nhất về sức khỏe.Vinhomes Times City Park Hill khu đô thị được đánh giá đáng sống nhất Việt Nam được so sánh như resort trong lòng thủ đô. Với chương trình ưu đãi cực khủng dành cho khách hàng là những cư dân cuối cùng của tòa Park Hill.- Nhận nhà nhanh trong năm 2016.- Trừ 4 triệu/ m2 khi thanh toán 95% giá trị căn hộ.- Tặng 10 năm phí dịch vụ (có trừ thẳng vào giá 1,65 triệu/ m2).- Hỗ trợ vay 70% giá căn hộ, lãi suất 0% trong 24 tháng.- Trừ 2,75 triệu/ m2 dành cho 5 tầng trên cùng khi nhận bàn giao bán nội thất.Với diện tích đa dạng 47m - 180m tương ứng với 1 phòng ngủ đến 5 phòng ngủ với thiết kế tối ưu diện tích căn hộ và tất cả các phòng đều có khe sáng.Hãy liên hệ với chúng tôi hotline: 0902 15 95 92 để được tư vấn tận tình 24/ 24.1 PN: 47m2- 59m2 giá từ 1,7 tỷ.2 PN: 68m2- 92m2 giá từ 2,1 tỷ.3 PN: 87m2- 125m2 giá từ 3,2 tỷ.4 PN: 128m2- 150m2 giá từ 4,2 tỷ.5 PN: 178m2- giá từ 7 Tỷ.Nhanh tay gọi cho chúng tôi để chọn căn hộ đẹp nhất, phù hợp nhất vơi nhu cầu của quý khách hàng.Hotline: 0902 15 95 92.\r\n        \r\n            ",
      "giaDisplay": "1.70 tỷ",
      "dienTichDisplay": "47 m²",
      "soNgayDaDangTin": 7
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/08/20160408142029-3afd.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/08/20160408142029-3afd.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408142029-3afd.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408142031-59cf.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408142051-7337.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408142051-8c78.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408142201-a9ba.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/08/20160408142201-720a.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408142029-3afd.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408142031-59cf.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408142051-7337.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408142051-8c78.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408142201-a9ba.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/08/20160408142201-720a.jpg"
        ]
      },
      "adsID": "SỐC, DUY NHẤT CƠ HỘI MUA CH TIMES CITY. DT 106M2, 3PN, GIÁ 3,2TỶ",
      "dangBoi": {
        "userID": "thanh.trongtinland@gmail.com",
        "email": "thanh.trongtinland@gmail.com",
        "name": "Nguyễn Thị Thanh",
        "phone": "0945198145"
      },
      "ngayDangTin": "08-04-2016",
      "gia": 2300,
      "dienTich": 80,
      "place": {
        "duAn": "Vinhomes Times City - Park Hill",
        "geo": {
          "lat": 20.994333267211914,
          "lon": 105.86756134033203
        },
        "diaChi": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Phường Vĩnh Tuy",
          "duong": "Đường Minh Khai"
        },
        "duAnFullName": "Vinhomes Times City - Park Hill, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 2,
      "soPhongTam": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Có thể bạn nghi ngờ, nhưng đây hoàn toàn là sự thật tại Times City - 458 Minh Khai - Hai Bà Trưng.Lần đầu tiên và duy nhất CĐT đưa ra những chính sách bán các căn hộ ưu đãi hết sức ưu đãi! Đừng chần chừ vì đây là cơ hội duy nhất biến ước mơ được sở hữu và cơ hội đầu tư CHCC với giá bình dân chỉ 28tr/m2.Hãy nhanh tay đăng ký để bố trí xem trực tiếp căn hộ các ngày trong tuần và lựa chọn ngay các căn đẹp:** Hotline: 0984.860.046 - 0945.198.145.Mở bán đợt cuối các căn hộ P1- P12 với các chính sách vô cùng hấp dẫn, giá chỉ từ 28 triệu/m2 (đã VAT và KPBT).Các căn hộ từ tòa P01-P08 gần đến thời điểm bàn giao, thiết kế hợp lý với các phòng đều có ánh sáng, nội thất cao cấp theo tiêu chuẩn 5 sao.** Đặc biệt khách hàng được tặng ngay khi mua căn hộ:• Tặng 10 năm gói dịch vụ quản lý căn hộ, tương đương với 1.68 triệu/m2.Tương đương từ 115 triệu đối với căn 2PN và 160 triệu với căn 3PN và 180 triệu với căn 4PN.• Giảm trừ bán hoàn thiện 2,75 triệu/m2 (điều hòa, bếp, tủ âm tường).Trừ ngay 190 triệu với căn 2PN, 260 triệu với căn 3PN, 300 triệu với căn 4PN.• Khách hàng không vay ngân hàng hưởng chiết khấu thẳng vào giá từ 270-450 triệu.Tương đương 270 triệu đối với căn 2PN, 360 triệu đối với căn 3PN và 450 triệu đối với căn 4PN.• Tặng 30 vé vui chơi giải trí (10 vé/năm).• Vay ưu đãi ngân hàng 75% lãi suất 0%/ 24 tháng. Ân hạn gốc và miễn phí phạt trả trước trong thời gian ưu đãi. Vay tối đa 25 năm.Như vậy:*** Căn 2PN giá chỉ từ 2,3 tỷ, diện tích 80m2.*** Căn 3PN giá chỉ từ 3,3 tỷ, diện tích từ 96m2-125m2.*** Căn 4PN giá chỉ từ 4 tỷ, diện tích từ 130-151m2.(Giá trên bao gồm VAT, KPBT, nội thất cơ bản).Khách quan tâm nhận thông tin và xem căn hộ trực tiếp vui lòng liên hệ: 0984.860.046 – 0945.198.145.Hoặc để lại tin nhắn qua SMS/Zalo/Viber để nhận thông tin về căn hộ sớm nhất. Rất vui được đồng hành cùng quý khách để lựa chọn được căn hộ ưng ý nhất. Xin cảm ơn!\r\n        \r\n            ",
      "giaDisplay": "2.30 tỷ",
      "dienTichDisplay": "80 m²",
      "soNgayDaDangTin": 13
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/13/uchaoWqV/20160413095205-e133.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/13/uchaoWqV/20160413095205-e133.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/13/uchaoWqV/20160413095205-e133.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/13/uchaoWqV/20160413095205-ea46.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/13/uchaoWqV/20160413095205-dbae.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/13/uchaoWqV/20160413095205-a5ad.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/13/uchaoWqV/20160413095205-0063.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/13/uchaoWqV/20160413095205-e133.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/13/uchaoWqV/20160413095205-ea46.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/13/uchaoWqV/20160413095205-dbae.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/13/uchaoWqV/20160413095205-a5ad.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/13/uchaoWqV/20160413095205-0063.jpg"
        ]
      },
      "adsID": "CHUNG CƯ PARK HILL GÓC NHÌN NHÀ ĐẦU TƯ, NHỮNG MÓN LỜI ĐƯỢC BIẾT TRƯỚC, HOTLINE 0934615566",
      "dangBoi": {
        "userID": "rosetimescity@gmail.com",
        "email": "rosetimescity@gmail.com",
        "name": "Mr Đạo",
        "phone": "0934615566"
      },
      "ngayDangTin": "13-04-2016",
      "gia": 2300,
      "dienTich": 80,
      "place": {
        "duAn": "Vinhomes Times City - Park Hill",
        "geo": {
          "lat": 20.9943332672119,
          "lon": 105.86756134033203
        },
        "diaChi": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Phường Vĩnh Tuy",
          "duong": "Đường Minh Khai"
        },
        "duAnFullName": "Vinhomes Times City - Park Hill, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 2,
      "soPhongTam": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "CƠ HỘI CUỐI CÙNG SỞ HỮU CĂN HỘ 5* BÙNG NỔ ƯU ĐÃI.Qua 1 năm phân phối bán lẻ. ngày 1/4/2016, Vinhomes mở nốt những căn hộ cuối cùng tại tòa tháp MASTER PARK 10. Tòa tháp 5* đắt giá nhất làng Timescity. Đồng thời, nhiều chính sách hấp dẫn mới thay lời chi ân cho những vị khách cuối cùng mua Park Hill Premium: + Tặng 10 năm phí dịch vụ (hoặc trừ thẳng vào giá bán 1.5 triệu/m2).+ Tặng vé vui chơi Vincom Mega Mail trị giá 6 triệu.+ Tách đồ rời (tủ lạnh, lò vi sóng, máy giặt, ti vi, sofa, bàn ăn, rèm cửa) giảm ngay 2,5 triệu/m2+  Gói bàn giao thô (không có thiết bị nội thất) cho những Căn 3,4 phòng ngủ. giảm ngay 4 triệu/m2CỰC HẤP DẪN GIẢM 9% GIÁ CĂN HỘ. Dành cho những khách hàng đã dự sẵn nguồn vốn tự có. Khi thanh toán trước hạn 95% GTCH, Chúng tôi giảm trừ vào giá bán Căn Hộ 9%. Đây là món quà chi ân chưa từng có trước đó. Theo chính sách này, Căn hộ 1PN nay chỉ còn 1,9 tỉ; 2PN giá còn 2,3 tỉ đồng.  TIỆN ÍCH PHỤC VỤ ĐẲNG CẤP HOÀNG GIA MIỄN PHÍ CHỌN ĐỜI.•\tTập gym và yoga tại phòng tập california hiện đại. Bố trí sát bể bơi, Thiết bị, máy tập hiện đại. 100%  miễn phí trọn đời. •\tBể bơi ngoài trời người lỡn, trẻ em, 3 sân thể thao liên hoàn, vườn thượng uyển view thành phố trên nóc tòa nhà. 100%  miễn phí trọn đời.•\tHệ thống căn hộ smartHome thông minh thượng hạng.NHỮNG LỰA CHỌN TUYỆT VỜI CHO QUÝ KHÁCH.+ Đầu tư trung hạn, và dài hạn nhằm sinh lời: Hãy lựa chọn Căn Hộ tại Park 12 với chính sách hỗ trợ và cam kết cho thuê của Chủ Đầu Tư. Thanh khoản nhanh hơn với tiện ích tập Gym, Yoga Calyfornia. 2,3 hoặc 4 phòng ngủ. Lợi nhuận được cam kết 8% giá trị căn hộ /năm+ Mua về ở, nhận nhà ngay sau 5 tháng, giá hấp dẫn nhất:Những căn hộ còn lại tại Park Hill giai đoạn 1, từ Park 1 đến Park 8 hẳn là lựa chọn tuyệt vời nhất thời điểm hiện tại. giá sau khi trừ ưu đãi từ 28 đến 32 triệu / m2. Còn khá nhiều lựa chọn 3,4 phòng ngủ. Hoặc 2 phòng ngủ tầng cao.+ Mua 1 Căn Hộ sở hữu tầm View mơ ước, không gian xanh trong lành: Park 10 tòa cuối cùng mới ra mắt, còn khá nhiều sự lựa chọn đẹp. Sở hữu hướng View màu xanh toàn Khu Đô Thị, đắt giá bậc nhất. Sở hữu vườn thượng uyển nghỉ dưỡng, vườn nướng BBQ cityview trên nóc tòa nhà. Bốc máy gọi mua ngay bây giờ: 0934615566 - Mr Đạo\r\n        \r\n            ",
      "giaDisplay": "2.30 tỷ",
      "dienTichDisplay": "80 m²",
      "soNgayDaDangTin": 8
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/07/20160407150555-a408.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/07/20160407150555-a408.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/07/20160407150555-a408.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/07/20160407150602-8f12.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/07/20160407150608-fb69.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/07/20160407150614-1215.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/07/20160407150636-78db.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/07/20160407150653-6455.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/07/20160407150555-a408.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/07/20160407150602-8f12.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/07/20160407150608-fb69.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/07/20160407150614-1215.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/07/20160407150636-78db.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/07/20160407150653-6455.jpg"
        ]
      },
      "adsID": "PARK HILL TIMES CITY GIẢM 800 TRIỆU - BÙNG NỔ GIAO DỊCH NHỜ CHÍNH SÁCH SIÊU KHỦNG - 0976182255",
      "dangBoi": {
        "userID": "rosetimescity@gmail.com",
        "email": "rosetimescity@gmail.com",
        "name": "Mr Đạo",
        "phone": "0976182255"
      },
      "ngayDangTin": "07-04-2016",
      "gia": 2300,
      "dienTich": 80,
      "place": {
        "duAn": "Vinhomes Times City - Park Hill",
        "geo": {
          "lat": 20.994333267211914,
          "lon": 105.86756134033203
        },
        "diaChi": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Phường Vĩnh Tuy",
          "duong": "Đường Minh Khai"
        },
        "duAnFullName": "Vinhomes Times City - Park Hill, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 2,
      "soPhongTam": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Cơ hội cuối cùng sở hữu căn hộ 5 sao, bùng nổ ưu đãi.Qua 1 năm phân phối bán lẻ. Ngày 1/4/2016, Vinhomes mở nốt những căn hộ cuối cùng tại tòa tháp Master Park 10. Tòa tháp 5* đắt giá nhất làng Timescity. Đồng thời, nhiều chính sách hấp dẫn mới thay lời chi ân cho những vị khách cuối cùng mua Park Hill Premium:+ Tặng 10 năm phí dịch vụ (hoặc trừ thẳng vào giá bán 1.5 triệu/m2).+ Tặng vé vui chơi Vincom Mega Mail trị giá 6 triệu.+ Tách đồ rời (tủ lạnh, lò vi sóng, máy giặt, ti vi, sofa, bàn ăn, rèm cửa).Giảm ngay 2,5 triệu/m2.+ Gói bàn giao thô (không có thiết bị nội thất) cho những Căn 3,4 phòng ngủ. Giảm ngay 4 triệu/m2.Cực hấp dẫn giảm 9% giá căn hộ.Dành cho những khách hàng đã dự sẵn nguồn vốn tự có. Khi thanh toán trước hạn 95% GTCH, Chúng tôi giảm trừ vào giá bán Căn Hộ 9%. Đây là món quà chi ân chưa từng có trước đó. Theo chính sách này, Căn hộ 1pn nay chỉ còn 1,9 tỉ. 2pn giá còn 2,3 tỉ đồng.Tiện ích phục vụ đẳng cấp hoàng gia miễn phí chọn đời.•\tTập gym và yoga tại phòng tập california hiện đại. Bố trí sát bể bơi, Thiết bị, máy tập hiện đại. 100% miễn phí trọn đời.•\tBể bơi ngoài trời người lỡn, trẻ em, 3 sân thể thao liên hoàn, vườn thượng uyển view thành phố trên nóc tòa nhà. 100% miễn phí trọn đời.•\tHệ thống căn hộ smartHome thông minh thượng hạng.Những lựa chọn tuyệt vời cho quý khách.+ Đầu tư trung hạn, và dài hạn nhằm sinh lời:Hãy lựa chọn căn hộ tại Park 12 với chính sách hỗ trợ và cam kết cho thuê của Chủ Đầu Tư. Thanh khoản nhanh hơn với tiện ích tập Gym, Yoga California. 2,3 hoặc 4 phòng ngủ. Lợi nhuận được cam kết 8% giá trị căn hộ /năm.+ Mua về ở, nhận nhà ngay sau 5 tháng, giá hấp dẫn nhất:Những căn hộ còn lại tại Park Hill giai đoạn 1, từ Park 1 đến Park 8 hẳn là lựa chọn tuyệt vời nhất thời điểm hiện tại. Giá sau khi trừ ưu đãi từ 28 tr đến 32 triệu/m2. Còn khá nhiều lựa chọn 3,4 phòng ngủ. Hoặc 2 phòng ngủ tầng cao.+ Mua 1 căn hộ sở hữu tầm view mơ ước, không gian xanh trong lành:Park 10 tòa cuối cùng mới ra mắt, còn khá nhiều sự lựa chọn đẹp. Sở hữu hướng View màu xanh toàn Khu Đô Thị, đắt giá bậc nhất. Sở hữu vườn thượng uyển nghỉ dưỡng, vườn nướng BBQ City View trên nóc tòa nhà.Bốc máy gọi mua ngay bây giờ: 0976 18 2255 - 0934 61 5566.\r\n        \r\n            ",
      "giaDisplay": "2.30 tỷ",
      "dienTichDisplay": "80 m²",
      "soNgayDaDangTin": 14
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/15/20160415090646-f08b.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/15/20160415090646-f08b.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415090646-f08b.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415090646-62d4.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415090647-6bdf.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415090647-ab88.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415090647-4678.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415090646-f08b.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415090646-62d4.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415090647-6bdf.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415090647-ab88.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415090647-4678.jpg"
        ]
      },
      "adsID": "PARK 10 – MASTER PREMIUM CĂN HỘ VIP ĐỈNH CAO NHẤT TIMES CITY",
      "dangBoi": {
        "userID": "dxmb@datxanhmienbac.vn",
        "email": "dxmb@datxanhmienbac.vn",
        "name": "datxanhmienbac",
        "phone": "0946547133"
      },
      "ngayDangTin": "15-04-2016",
      "gia": 2300,
      "dienTich": 68,
      "place": {
        "duAn": "Vinhomes Times City - Park Hill",
        "geo": {
          "lat": 20.994333267211914,
          "lon": 105.86756134033203
        },
        "diaChi": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Phường Vĩnh Tuy",
          "duong": "Đường Minh Khai"
        },
        "duAnFullName": "Vinhomes Times City - Park Hill, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City - Park Hill, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội"
      },
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Park 10 – Master Premium là tòa căn hộ cuối cùng khép lại toàn bộ dự án quần thể Times City giá chỉ từ 2,3 tỷ, tiếp tục kế thừa những thành tựu kiến trúc mang phong cách sống Resort trong lòng đô thị, Park 10 – Master Premium ôm trọn 4 mặt view thoáng mát: Quảng trường nhạc nước, các tiện ích Times giai đoạn 1, khu vui chơi, nhìn vào không gian bể bơi dài 80m. Có vị trí trung tâm tại ngã tư giao cắt các trục tuyến đường chính lưu thông vô cùng thuận tiện. Hơn thế tòa căn hộ là tòa duy nhất sở hữu vườn thượng uyển trên cao, vườn nướng BBQ, vườn dạo mang phong cách Nhật Bản đem lại không gian sống thư giãn tuyệt vời cho cư dân.Tổng quan tòa căn hộ Park 10.Số tầng: 34.Chiều cao thông thủy: 2,65m.Thang máy: 12 thang máy, 2 thang thoát hiểm.Loại căn hộ: 1-5 phòng ngủ, 18 căn/sàn.Diện tích căn hộ: 68m2 – 178,4m2.Phía Đông: View nhìn ra toàn cảnh trục đường chính số 1 của KĐT Times City, nhìn chính diện sang quảng trường và toàn cảnh Park Hill giai đoạn 2.Phía Tây: Nhìn sang toàn Park 9, hệ thống cây xanh.Phía Nam: Nhìn vào không gian mát mẻ bể bơi dài 80m, khuôn viên sinh hoạt của cư dân Park Hill Premium và nhìn sang tòa Park 11.Phía Bắc: View mặt tiền nhìn trọn vẹn ra trục đường huyết mạch toàn khu Times City, nhìn ra quảng trường nhạc nước, trường học Vinshool, bệnh viện Vinmec.. vv.Điểm nhấn nổi bật của riêng tòa căn hộ vip đẳng cấp thời thượng.•\tTòa căn hộ duy nhất có vườn thượng uyển, vườn nướng BBQ trên cao, mang lại không gian sống thư thoáng, tuyệt vời cho cư dân.•\tHệ thống bể bơi dài 80m nằm giữa trung tâm 4 tòa căn hộ tạo nên sự thoáng mát, thư giãn thoải mái, giải tỏa stress cho cư dân sau nhưng ngày làm việc mệt mỏi, hay những ngày hè oi bức...•\tHệ điều khiển thông minh Smart Home – Smart Living tích hợp ngay trên Smart Phone cá nhân, máy tính bảng, ipad giúp cư dân dễ dàng điều khiển ngay cả khi ở bên ngoài..•\tHơn 30 tiện ích cảnh quan hội tụ, được thiết kế tinh tế.100% các tòa căn hộ được sử dụng tối ưu diện tích, đủ khe sáng, đem thiên nhiên, ánh sáng trực tiêp tới từng phòng..•\tBàn giao thô cho riêng 4 căn hộ 3,4,5,6 chỉ riêng Park 10 mới có..•\tMang phong cách Resort riêng tư đẳng cấp, yên tĩnh thế nên mật độ căn hộ nơi đây chỉ ở mức 18 căn trên sàn, bao gồm 12 thang máy luôn đảm bảo lưu thông cho cư dân.Hoặc liên hệ hotline để được tư vấn trực tiếp: 0977 955 692 – 0946 547 133.\r\n        \r\n            ",
      "giaDisplay": "2.30 tỷ",
      "dienTichDisplay": "68 m²",
      "soNgayDaDangTin": 6
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/01/23/20160123083134-53bf.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/01/23/20160123083134-53bf.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083134-53bf.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083138-eb9c.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083151-d215.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083203-2e94.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083237-9077.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083255-ad8d.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083310-9b9c.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083329-3744.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083342-5e32.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083352-805f.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083403-0389.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083415-e39e.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083440-f55a.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083451-ff5b.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/01/23/20160123083507-550f.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083134-53bf.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083138-eb9c.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083151-d215.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083203-2e94.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083237-9077.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083255-ad8d.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083310-9b9c.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083329-3744.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083342-5e32.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083352-805f.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083403-0389.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083415-e39e.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083440-f55a.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083451-ff5b.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/01/23/20160123083507-550f.jpg"
        ]
      },
      "adsID": "BÁN CẮT LỖ CHCC TIMES CITY, DIỆN TÍCH: 117M2 GIÁ 3.9 TỶ, DIỆN TÍCH: 90M2, GIÁ 2.8 TỶ",
      "dangBoi": {
        "userID": "thuhatimescity@gmail.com",
        "email": "thuhatimescity@gmail.com",
        "name": "Vũ Thu Hà",
        "phone": "0913406118"
      },
      "ngayDangTin": "11-04-2016",
      "gia": 3900,
      "dienTich": 117,
      "place": {
        "duAn": "Times City",
        "geo": {
          "lat": 20.99544349877619,
          "lon": 105.86968088150024
        },
        "diaChi": "Dự án Times City, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Phường Vĩnh Tuy",
          "duong": "Đường Minh Khai"
        },
        "duAnFullName": "Times City, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Times City, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 3,
      "soPhongTam": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Bạn đang có nhu cầu muốn mua nhà ở ngay trước Tết, giá hợp lý tại Times City. Bạn đang lo lắng chưa tìm được căn hộ ưng ý, hãy gọi lại cho chúng tôi.Hiện nay đang có một số căn hộ cần bán sau:- Căn hộ 117m2 – 03PN – 02 WC, căn góc ban công hướng Nam, nội thất hoàn thiện của chủ đầu tư, view nhìn ra bể bơi, cầu Thanh Trì, không bị chắn bởi các tòa. Giá bán: 3.9 tỷ.- Căn hộ 108m2 – 03PN – 02 WC, ban công hướng Tây, nội thất: Đã sửa sang lại phòng khách, bếp, điều hòa, lắp tủ âm tường thêm. Giá bán: 3.8tỷ(bao phí cho khách hàng).- Căn hộ 94m2 – 03PN – 02WC, ban công hướng Bắc, đã sửa thành 3 phòng hợp lý để lại toàn bộ chị mang đồ điện tử. Giá bán: 3.3tỷ.- Căn hộ 82m2 – 02PN -02WC, ban công hướng Bắc, đã có đầy đủ nội thất có thể mang vali vào ở luôn. Giá bán: 2.9 tỷ.- Căn hộ 53m2 – 1PN – 1WC, ban công hướng Bắc, nội thất cơ bản của chủ đầu tư. Giá bán: 1.8 tỷ.Tiện ích: Miễn phí 10 năm dịch vụ, sân chơi thể thao, trung tâm thương mại….Liên hệ: Thu Hà: 0913.406.118 hoặc 0973.996.538.\r\n        \r\n            ",
      "giaDisplay": "3.90 tỷ",
      "dienTichDisplay": "117 m²",
      "soNgayDaDangTin": 10
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/15/20160415101348-b8dc.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/15/20160415101348-b8dc.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415101348-b8dc.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415101348-beb8.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415101348-ca88.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415101348-bc27.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/15/20160415101348-dfe2.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415101348-b8dc.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415101348-beb8.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415101348-ca88.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415101348-bc27.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/15/20160415101348-dfe2.jpg"
        ]
      },
      "adsID": "LỢI NHUẬN LÊN TỚI 700 TRIỆU KHI MUA CĂN HỘ 3,1 TỶ TẠI PARK 12",
      "dangBoi": {
        "userID": "dxmb@datxanhmienbac.vn",
        "email": "dxmb@datxanhmienbac.vn",
        "name": "datxanhmienbac",
        "phone": "0988965351"
      },
      "ngayDangTin": "15-04-2016",
      "gia": 3100,
      "dienTich": 79.2,
      "place": {
        "duAn": "Park 12 Park Hill - Times City",
        "geo": {
          "lat": 20.996578216552734,
          "lon": 105.86519622802734
        },
        "diaChi": "Dự án Park 12 Park Hill - Times City, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Phường Vĩnh Tuy",
          "duong": "Đường Minh Khai"
        },
        "duAnFullName": "Park 12 Park Hill - Times City, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Park 12 Park Hill - Times City, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 2,
      "soPhongTam": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Chi tiết căn hộ 3,1 tỷ.- Diện tích: 79,2 m2.- 2 phòng ngủ 2 phòng vệ sinh.- Cửa hướng Nam, ban công hướng Bắc.- Full nội thất rời, Smathome, đầy đủ 30 tiện ích, tập gym miễn phí, phòng buffet ăn sáng, phòng họp phòng hội nghĩ miễn phí.- Giá 3,1 tỷ.Lợi nhuận khủng đến từ đâu?Bài toán đầu tư.- VD khách hàng có 3,1 tỷ khách hàng mua căn hộ 2 phòng ngủ 3,1 tỷ ở Park 12.+ Kết hợp với chính sách CĐT hỗ trợ khách hàng vay 70% giá trị hợp đồng với LS 0% trong 20 tháng. Thì khách hàng chỉ cần phải bỏ ra 30% số tiền để sở hữ căn hộ, còn 70% còn lại khách hàng đi đầu tư hoặc gửi ngân hàng với mức lãi suất khoảng 6%/năm ước tính trong 20 tháng là khoảng 210 triệu. Và hết 20 tháng khách hàng rút tiền ngân hàng trả nốt 70% còn lại sẽ không mất 1 đồng lãi nào.+ CĐT cam kết thuê lại 8%/năm trong 2 năm tức trong 2 năm nó khách hàng lợi nhân với mức: 16%*3,1 tỷ = 496 triệu.- Chỉ tính 2 khoản này khách hàng đã có chắc chắn trong tay 704 triệu, chưa kể khách hàng không phải mua nội thất rời đã cắt bớt chi phí đi ít nhất 200 triệu.- Như vậy trong khoảng gần 3 năm khách hàng chỉ phải mua căn hộ 79m2 tại Park 12 Park Hill với giá chỉ khoảng 2,2 tỷ một cái giá quá tốt khách hàng mua căn hộ để đầu tư.- Nếu bạn quan tâm vui lòng liên hệ số hotline: 0988 965 351.1. Chính sách ưu đãi hấp dẫn:+ Cam kết thuê lại trong 2 năm với mức lãi suất cao.+ Hỗ trợ cho vay tới 70% với lãi xuất 0%.+ Miễn phí phòng tập gym trọn đời chỉ giành cho cư dân Park 12.+ Phòng buffet ăn sáng chỉ giành cho cư dân Park 12.+ Phòng họp miễn phí dành cho cư dân chỉ giành cho cư dân Park 12.+ Được trang bị toàn bộ hệ thống nội thất rời, sang trọng của Index Living khi giao nhận nhà, khách hàng chỉ việc vác vali đến ở.2. Vị trí:+ Là 1 trong 4 tòa nhà cao cấp nhất trong hệ thống Timescity Park Hill.+ Nằm trọng vị trí đắc địa nhất với 2 mặt tiền view thành phố.+ Phía bắc view bể bơi vô cực và tòa Park 9.+ Phía Đông view tòa Park 11.+ Phía Nam view trường học Vinschool, khu thể thao, hồ yên sở và toàn cảnh thành phổ.+ Phía Tây view trung tâm thành phố hà nội.+ Là một trong những tòa nhà hiếm hoi có ánh sáng tự nhiên ở tất cả các phòng.Các bạn hãy đặt mua ngay để sở hữu nhưng căn hộ ưng ý.Hotline: 0988 965 351.\r\n        \r\n            ",
      "giaDisplay": "3.10 tỷ",
      "dienTichDisplay": "79.2 m²",
      "soNgayDaDangTin": 6
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/04/XFD0ig7V/20160404172018-7a13.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/04/XFD0ig7V/20160404172018-7a13.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404172018-7a13.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171323-be5a.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171324-6cfc.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171308-c3a0.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171323-0e3e.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404172018-9d34.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171324-44b3.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171324-21db.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171324-8ca3.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171324-268a.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171324-f286.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171658-a5bb.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171324-bd59.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171324-cd77.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/04/XFD0ig7V/20160404171658-1a6a.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/16/20160416003544-1301.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404172018-7a13.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171323-be5a.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171324-6cfc.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171308-c3a0.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171323-0e3e.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404172018-9d34.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171324-44b3.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171324-21db.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171324-8ca3.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171324-268a.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171324-f286.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171658-a5bb.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171324-bd59.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171324-cd77.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/04/XFD0ig7V/20160404171658-1a6a.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/16/20160416003544-1301.jpg"
        ]
      },
      "adsID": "KHẲNG ĐỊNH MỤC TIÊU NGƯỜI VIỆT TIN DÙNG HÀNG VIỆT ĐẲNG CẤP.CHCC HÒA BÌNH GREENCITY 505 MINH KHAI HN",
      "dangBoi": {
        "userID": "quynhsaleanyhome@gmail.com",
        "email": "quynhsaleanyhome@gmail.com",
        "name": "pham van quynh",
        "phone": "0985696366"
      },
      "ngayDangTin": "14-04-2016",
      "gia": 2100,
      "dienTich": 70,
      "place": {
        "duAn": "Hòa Bình Green City",
        "geo": {
          "lat": 21.0005155265887,
          "lon": 105.869869709015
        },
        "diaChi": "Dự án Hòa Bình Green City, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hai Bà Trưng",
          "xa": "Phường Vĩnh Tuy",
          "duong": "Đường Minh Khai"
        },
        "duAnFullName": "Hòa Bình Green City, Hai Bà Trưng, Hà Nội",
        "diaChinhFullName": "Dự án Hòa Bình Green City, Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng, Hà Nội"
      },
      "soPhongNgu": 2,
      "soPhongTam": 2,
      "loaiTin": 0,
      "loaiNhaDat": 1,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Căn hộ chung cư",
      "chiTiet": "Sống đẳng cấp hưởng trọn dịch vụ giá mềm với thương hiệu của người Việt Nam. Vì mục tiêu (Người Việt Dùng Hàng Việt) Hòa Bình Green City Tòa nhà đẳng cấp nhất của người Việt Nam.\r\rGiá không tưởng CHCC. Tổng chiết khấu 8%. Nhanh tay SLCH.\rTổng chiết khấu cực cao lên đến 8% đến hết ngày 30/04/2016. Chính chủ bán lại 2 căn view sông Hồng full nội thất đẳng cấp 6* giá cả thương lượng.\r\r+ Khách thanh toán 100% được chiết khấu 4%.\r\r+ Tặng 4% gói quà tặng trừ vào giá trị căn hộ.\r\r+ Hỗ trợ vay ngân hàng, chỉ cần đóng 30% giá trị căn hộ được nhận nhà ở ngay, hỗ trợ vay với lãi suất 6% trong 2 năm đầu.\r\r+ Hỗ trợ cho thuê lại căn hộ giá cao từ 9 - 13 tr/tháng đối với các căn 2PN.\r\r+ Đặc biệt khách hàng có cơ hội bốc thăm trúng thưởng ngày mở bán với nhiều quà tặng.\r\rGiá căn hộ chỉ từ: 2.1 tỷ/căn 70m2 (chưa VAT).\rThông tin dự án và giá bán vui lòng liên hệ PKD CĐT: 0903 389 688.\r\rThông tin dự án:\r\rI. Chủ đầu tư: Công ty TNHH Hòa Bình.\rVị trí: 505 Minh Khai – Hai Bà Trưng – Hà Nội.\rTổng diện tích: 17.377 m2.\rQuy mô xây dựng: 2 tòa tháp cao 27 tầng.\r\rII. Công nghệ xây dựng hiện đại.\r\r- Hòa Bình Green City được xây dựng với khả năng chịu được động đất cấp 8 với vách bê tông dày 250mm, tường dày 350mm, sàn bê tông dự ứng lực với độ dày 220-240mm.\r- Công trình sử dụng kính hộp an toàn Double Glazing Glass với 3 lớp kính, 1 lớp chân không có khả năng cách âm, cách nhiệt, giảm thiểu nhu cầu sử dụng điện năng sưởi ấm hay làm mát.\r- Sảnh chính, cửa thang máy và ban công được mạ vàng 18k, 24k tạo nên vẻ sang trọng và đẳng cấp.\r\rIII. Thông tin căn hộ và tiện ích.\r\r- Vật liệu hoàn thiện là vật liệu và thiết bị cao cấp: Thiết bị vệ sinh Toto dòng cao cấp nhất mạ vàng 24k, công tắc điện Hager, bếp điện từ, máy hút mùi Hefele, điều hòa Inverter Daikin, bình nước nóng Ferroli cùng hàng loạt các thương hiệu cao cấp khác.\r\r+ Diện tích căn hộ tòa B: 68.9m2; 69.6m2; 69.8m2; 70.6m2; 72m2; 140m2.\r\rChung cư Hòa Bình Green City được thiết kế với ý tưởng hòa hợp thiên nhiên với con người, đồng thời vẫn đảm bảo một cuộc sống hiện đại, phóng khoáng.\r– Hệ thống lọc nước tinh khiết uống trực tiếp tại tất cả các vòi trong căn hộ là hệ thống lần đầu tiên được lắp đặt cho căn hộ tại Hà Nội.\r– Hệ thống diện dự phòng công suất 100%.\r– Với 3 tầng hầm để xe, mỗi căn hộ sẽ có 1 suất để ô tô và 2 suất để xe máy.\r– Lối tản bộ xanh mát giữa 2 tòa nhà rộng hàng trăm m2.\r– Khu sinh thái trên tầng mái có sân tập golf, khu dạo bộ, khu tổ chức tiệc nướng, khu vực tâm linh giúp bảo tồn những giá trị truyền thống là một khu vực sinh hoạt chung rất tuyệt cho cư dân nơi đây.\r– 5 tầng dịch vụ cung cấp đầy đủ các tiện ích: Bể bơi 4 mùa, bể sục, phòng xông hơi, phòng gym, spa, vườn treo với rất nhiều cây xanh và hoa hồng, cùng chuỗi ngân hàng, đại siêu thị sẽ đảm bảo một cuộc sống thuận tiện nhất cho cư dân nơi đây.\r\rLiên hệ PKD CĐT: 0903 389 688.\r\n        \r\n            ",
      "giaDisplay": "2.10 tỷ",
      "dienTichDisplay": "70 m²",
      "soNgayDaDangTin": 7
    },
    {
      "type": "Ads",
      "image": {
        "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/04/05/20160405151009-a6ce.jpg",
        "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/05/20160405151009-a6ce.jpg",
        "images_small": [
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405151009-a6ce.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405151009-8d12.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405151010-491c.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405151010-bd80.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405151011-dfa2.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405151011-26d7.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405151012-ec4f.jpg",
          "http://file4.batdongsan.com.vn/resize/80x60/2016/04/05/20160405151012-fbac.jpg"
        ],
        "images": [
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405151009-a6ce.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405151009-8d12.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405151010-491c.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405151010-bd80.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405151011-dfa2.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405151011-26d7.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405151012-ec4f.jpg",
          "http://file4.batdongsan.com.vn/resize/745x510/2016/04/05/20160405151012-fbac.jpg"
        ]
      },
      "adsID": "CHÍNH CHỦ BÁN BIỆT THỰ NHÀ VƯỜN GẦN TIMES CITY. GIÁ RẺ",
      "dangBoi": {
        "userID": "vannguyen236@gmail.com",
        "email": "vannguyen236@gmail.com",
        "name": "Vân Nguyễn",
        "phone": "0904678944"
      },
      "ngayDangTin": "05-04-2016",
      "gia": 5500,
      "dienTich": 154,
      "place": {
        "geo": {
          "lat": 20.9989754065565,
          "lon": 105.87979316711494
        },
        "diaChi": "Đường Vĩnh Hưng, Hoàng Mai, Hà Nội",
        "diaChinh": {
          "tinh": "Hà Nội",
          "huyen": "Hoàng Mai",
          "xa": "Đường Vĩnh Hưng"
        },
        "duAnFullName": null,
        "diaChinhFullName": "Đường Vĩnh Hưng, Hoàng Mai, Hà Nội"
      },
      "soPhongNgu": 4,
      "soPhongTam": 2,
      "soTang": 3,
      "loaiTin": 0,
      "loaiNhaDat": 2,
      "ten_loaiTin": "Bán",
      "ten_loaiNhaDat": "Nhà riêng",
      "chiTiet": "Nhà xây theo kiểu biệt thự Pháp có vườn nhỏ, ao cá nhỏ rất thoáng mát, thích hợp để ở, nghỉ dưỡng cho gia đình.* Diện tích: 154 m2.* Hướng: Tây Bắc.* 3 tầng, 1 phòng khách, 1 phòng bếp, 4 phòng ngủ, 1 phòng thờ, 2 WC.* Địa chỉ: Số 30 – Ngõ 448 - Phố Vĩnh Hưng - Hoàng Mai- Hà Nội.Ngõ 448 ở cuối phố Vĩnh Hưng (dốc Đoàn Kết) gần đê Nguyễn Khoái đoạn cầu Vĩnh Tuy, từ đây ra hồ Hoàn Kiếm khoảng 4km, cách Times City 1km, giao thông rất thuận lợi, ngõ yên tĩnh.Giá bán: 5.5 tỷ. Sang tên sổ đỏ cho người mua.Liên hệ chính chủ:C. Vân: 0904 678 944.\r\n        \r\n            ",
      "giaDisplay": "5.50 tỷ",
      "dienTichDisplay": "154 m²",
      "soNgayDaDangTin": 16
    }
  ]
}