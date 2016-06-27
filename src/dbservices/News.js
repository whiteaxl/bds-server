'use strict';
var mysql = require("mysql");
var util = require("../lib/utils");
/*
var connection = mysql.createConnection({
    host : "localhost",
    user : "reland",
    password : "Zi3Iyh0xSxPztlET",
    database : "reland"
});
*/
var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'reland',
    password : 'Zi3Iyh0xSxPztlET',
    database : 'reland',
    debug    :  false
});

class NewsModel {

    findNewsByType(newsType, callback){
        console.log("-----getNewsByType");
        pool.getConnection(function(err,connection){
            if (err) {
                console.log(err);
                connection.release();
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query("SELECT * FROM news_article",function(err,rows){
                connection.release();
                if(err)
                {
                    console.log("Problem with MySQL"+err);
                }
                else
                {
                    //res.end(JSON.stringify(rows));
                    console.log("-----getNewsByType: success");
                    if (!rows)
                        rows = [];
                    console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                    callback(err, rows);
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            });
        });
    }
    findRootCategory(callback){
        console.log("-----findRootCategory");
        pool.getConnection(function(err,connection){
            if (err) {
                console.log(err);
                connection.release();
                return;
            }

            console.log('connected as id ' + connection.threadId);

            var sql = "SELECT * FROM reland.news_article_category where cat_parent_id=0 order by cat_order";
            connection.query(sql ,function(err,rows){
                connection.release();
                if(err)
                {
                    console.log("Problem with MySQL"+err);
                }
                else
                {
                    console.log("-----findRootCategory: success");
                    if (!rows)
                        rows = [];
                    callback(err, rows);
                }
            });
        });
    }

    countAllArticleOfCat(catId, callback){
        console.log("------in countAllArticleOfCat---: " + catId);
        var listCat = [];
        var catIdStr = "";
        var callback1 =(err,all) => {
            if(err){
                console.log("Problem with MySQL"+err);
            } else{
                console.log("-----countAllArticleOfCat--success");
                console.log("size:" + all.length);
                for (var i = 0; i < all.length; i++) {

                    if((listCat.indexOf(all[i].lev1) == -1) && (all[i].lev1 != null))
                        listCat.push(all[i].lev1);
                    if((listCat.indexOf(all[i].lev2) == -1) && (all[i].lev2 != null))
                        listCat.push(all[i].lev2);
                    if((listCat.indexOf(all[i].lev3) == -1) && (all[i].lev3 != null))
                        listCat.push(all[i].lev3);
                    if((listCat.indexOf(all[i].lev4) == -1) && (all[i].lev4 != null))
                        listCat.push(all[i].lev4);
                }
            }
            if(listCat.length > 0){
                for(var i=0; i<listCat.length; i++){
                    catIdStr += listCat[i] + ",";
                }
            }
            if(catIdStr.length > 1)
                catIdStr = catIdStr.substring(0,catIdStr.length -1);
            var sql = "SELECT count(*) countArticle FROM reland.news_article where cat_id in (" + catIdStr + ")";
            console.log("countAllArticleOfCat--------sql: " + sql);
            pool.getConnection(function(err,connection){
                if (err) {
                    console.log(err);
                    connection.release();
                    return;
                }

                console.log('connected as id ' + connection.threadId);

                console.log("countAllArticleOfCat--pool--------sql: " + sql);

                connection.query(sql ,function(err, rows){
                    connection.release();
                    if (!rows){
                        rows = [];
                    }
                    callback(err, rows);
                });
            });
        };

        this.getAllChildOfCat(catId, callback1);
    }

    findAllArticleOfCat(catId, pageNo, pageSize, callback){
        console.log("------in findAllArticleOfCat---catId : " + catId);
        console.log("------in findAllArticleOfCat---pageNo : " + pageNo);
        console.log("------in findAllArticleOfCat---pageSize : " + pageSize);
        var listCat = [];
        var catIdStr = "";
        var callback1 =(err,all) => {
            if(err){
                console.log("Problem with MySQL"+err);
            } else{
                console.log("-----getAllChildOfCat--success");
                console.log("size:" + all.length);
                for (var i = 0; i < all.length; i++) {

                    if((listCat.indexOf(all[i].lev1) == -1) && (all[i].lev1 != null))
                        listCat.push(all[i].lev1);
                    if((listCat.indexOf(all[i].lev2) == -1) && (all[i].lev2 != null))
                        listCat.push(all[i].lev2);
                    if((listCat.indexOf(all[i].lev3) == -1) && (all[i].lev3 != null))
                        listCat.push(all[i].lev3);
                    if((listCat.indexOf(all[i].lev4) == -1) && (all[i].lev4 != null))
                        listCat.push(all[i].lev4);
                }
            }
            if(listCat.length > 0){
                for(var i=0; i<listCat.length; i++){
                    catIdStr += listCat[i] + ",";
                }
            }
            if(catIdStr.length > 1)
                catIdStr = catIdStr.substring(0,catIdStr.length -1);
            var limitQuery = "";
            if(pageNo > 1){
                limitQuery = " limit " + (pageNo-1)*pageSize + "," + pageSize;
            } else{
                limitQuery = " limit " + pageSize;
            }
            var sql = "SELECT news.*, cat.cat_name FROM reland.news_article news, reland.news_article_category cat " +
                      "where news.cat_id in (" + catIdStr + ") and news.cat_id = cat.cat_id " + limitQuery;
            console.log("findAllArticleOfCat--------sql: " + sql);
            pool.getConnection(function(err,connection){
                if (err) {
                    console.log(err);
                    connection.release();
                    return;
                }

                console.log('connected as id ' + connection.threadId);

                connection.query(sql ,function(err, rows){
                    connection.release();
                    if (!rows){
                        rows = [];
                    }
                    callback(err, rows);
                });
            });
        };

        this.getAllChildOfCat(catId, callback1);
    }

    findHightestArticle(catId, callback){
        console.log("------in findHightestArticle---catId : " + catId);
        var listCat = [];
        var catIdStr = "";
        var callback1 =(err,all) => {
            if(err){
                console.log("Problem with MySQL"+err);
            } else{
                console.log("-----getAllChildOfCat--success");
                console.log("size:" + all.length);
                for (var i = 0; i < all.length; i++) {

                    if((listCat.indexOf(all[i].lev1) == -1) && (all[i].lev1 != null))
                        listCat.push(all[i].lev1);
                    if((listCat.indexOf(all[i].lev2) == -1) && (all[i].lev2 != null))
                        listCat.push(all[i].lev2);
                    if((listCat.indexOf(all[i].lev3) == -1) && (all[i].lev3 != null))
                        listCat.push(all[i].lev3);
                    if((listCat.indexOf(all[i].lev4) == -1) && (all[i].lev4 != null))
                        listCat.push(all[i].lev4);
                }
            }
            if(listCat.length > 0){
                for(var i=0; i<listCat.length; i++){
                    catIdStr += listCat[i] + ",";
                }
            }
            if(catIdStr.length > 1)
                catIdStr = catIdStr.substring(0,catIdStr.length -1);

            var sql = "SELECT * FROM reland.news_article where cat_id in (" + catIdStr + ") order by rating_count desc limit 5";
            console.log("findHightestArticle--------sql: " + sql);
            pool.getConnection(function(err,connection){
                if (err) {
                    console.log(err);
                    connection.release();
                    return;
                }

                console.log('connected as id ' + connection.threadId);

                connection.query(sql ,function(err, rows){
                    connection.release();
                    if (!rows){
                        rows = [];
                    }
                    callback(err, rows);
                });
            });
        };

        this.getAllChildOfCat(catId, callback1);
    }

    findHotArticle(catId, callback){
        console.log("------in findHotArticle---catId : " + catId);
        var listCat = [];
        var catIdStr = "";
        var callback1 =(err,all) => {
            if(err){
                console.log("Problem with MySQL"+err);
            } else{
                console.log("-----getAllChildOfCat--success");
                console.log("size:" + all.length);
                for (var i = 0; i < all.length; i++) {

                    if((listCat.indexOf(all[i].lev1) == -1) && (all[i].lev1 != null))
                        listCat.push(all[i].lev1);
                    if((listCat.indexOf(all[i].lev2) == -1) && (all[i].lev2 != null))
                        listCat.push(all[i].lev2);
                    if((listCat.indexOf(all[i].lev3) == -1) && (all[i].lev3 != null))
                        listCat.push(all[i].lev3);
                    if((listCat.indexOf(all[i].lev4) == -1) && (all[i].lev4 != null))
                        listCat.push(all[i].lev4);
                }
            }
            if(listCat.length > 0){
                for(var i=0; i<listCat.length; i++){
                    catIdStr += listCat[i] + ",";
                }
            }
            if(catIdStr.length > 1)
                catIdStr = catIdStr.substring(0,catIdStr.length -1);

            var sql = "SELECT * FROM reland.news_article where cat_id in (" + catIdStr + ") and is_hot = 1 order by rating_count desc limit 5";
            console.log("findHotArticle--------sql: " + sql);
            pool.getConnection(function(err,connection){
                if (err) {
                    console.log(err);
                    connection.release();
                    return;
                }

                console.log('connected as id ' + connection.threadId);

                connection.query(sql ,function(err, rows){
                    connection.release();
                    if (!rows){
                        rows = [];
                    }
                    callback(err, rows);
                });
            });
        };

        this.getAllChildOfCat(catId, callback1);
    }

    findArticleDetail(articleId, callback){
        var sql = "SELECT cat.cat_name, news.article_id, news.title, news.content_desc, news.posted_date, pg.page_id, pg.content_detail, pg.author "
                + " FROM reland.news_article_page_content pg, reland.news_article news, reland.news_article_category cat"
                + " where pg.article_id = news.article_id"
                + " and news.cat_id = cat.cat_id"
                + " and news.article_id = " + articleId;
        console.log("findArticleDetail--------sql: " + sql);

        pool.getConnection(function(err,connection){
            if (err) {
                console.log(err);
                connection.release();
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(sql ,function(err, rows){
                connection.release();
                if (!rows){
                    rows = [];
                }
                callback(err, rows);
            });
        });
    }

    increaseRating(rootCatId, articleId, callback){
        var sql = "UPDATE reland.news_article "
            + " SET rating_count = IFNULL(rating_count, 0) + 1"
            + " where article_id = " + articleId;
        console.log("findArticleDetail--------sql: " + sql);

        pool.getConnection(function(err,connection){
            if (err) {
                console.log(err);
                connection.release();
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(sql ,function(err, rows){
                connection.release();
                callback(err, rows);
            });
        });
    }

    getAllChildOfCat(catId, callback) {
        console.log("------in getAllChildOfCat---");
        var sql = "SELECT t1.cat_id AS lev1, t2.cat_id as lev2, t3.cat_id as lev3, t4.cat_id as lev4 "
                    + " FROM reland.news_article_category AS t1"
                    + " LEFT JOIN reland.news_article_category AS t2 ON t2.cat_parent_id = t1.cat_id"
                    + " LEFT JOIN reland.news_article_category AS t3 ON t3.cat_parent_id = t2.cat_id"
                    + " LEFT JOIN reland.news_article_category AS t4 ON t4.cat_parent_id = t3.cat_id"
                    + " WHERE t1.cat_id = " + catId;

        console.log("-----getAllChildOfCat----- sql : " +sql);
        pool.getConnection(function(err,connection){
            if (err) {
                console.log(err);
                connection.release();
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(sql ,function(err, rows){
                connection.release();
                if (!rows){
                    rows = [];
                }
                callback(err, rows);
            });
        });
    }
}

module.exports = NewsModel;