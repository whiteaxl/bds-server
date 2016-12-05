curl -H "Content-Type: application/json" -X POST -d '{"loaiTin":0,"loaiNhaDat":2,"soPhongNguGREATER":2,"giaBETWEEN":"1000,2000"}' http://localhost:5000/api/find

// ?loaiTin=0&loaiNhaDat=0&giaBETWEEN=1000,2000&soPhongNguGREATER=2
// &spPhongTamGREATER=1&dienTichBETWEEN=50,200
// &orderBy=giaASC,dienTichDESC,soPhongNguASC


large:
http://file4.batdongsan.com.vn/resize/745x510/2016/03/20/20160320175550-e95c.jpg

small:
http://file4.batdongsan.com.vn/resize/80x60/2016/03/17/20160317184433-6d1e.jpg

cover:
http://file4.batdongsan.com.vn/crop/120x90/2016/03/17/20160317184433-6d1e.jpg



http://file4.batdongsan.com.vn/crop/745x510/2016/03/17/20160317184433-6d1e.jpg

node dothi/dt_huyen_HN_HCM.js > dt_huyen_HN_HCM.log &

14 01 * * * node /u01/code/bds-server/src/data/dothi/dt_huyen_HN_HCM.js > /u01/script/log/dt_huyen_HN_HCM.log &
19 17 * * * node /u01/code/bds-server/src/data/bds/bds_huyen_HN_HCM.js > /u01/script/log/bds_huyen_HN_HCM.log &

/Applications/Couchbase\ Server.app/Contents/Resources/couchbase-core/bin/cbbackup http://203.162.13.177 /tmp/backup_01 -u admin -p m1tkh\!u --single-node -b default

/Applications/Couchbase\ Server.app/Contents/Resources/couchbase-core/bin/cbrestore /tmp/backup_01 http://localhost -b default -u Administrator -p 123456 -x rehash=1