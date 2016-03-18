curl -H "Content-Type: application/json" -X POST -d '{"loaiTin":0,"loaiNhaDat":2,"soPhongNguGREATER":2,"giaBETWEEN":"1000,2000"}' http://localhost:5000/api/find

// ?loaiTin=0&loaiNhaDat=0&giaBETWEEN=1000,2000&soPhongNguGREATER=2
// &spPhongTamGREATER=1&dienTichBETWEEN=50,200
// &orderBy=giaASC,dienTichDESC,soPhongNguASC