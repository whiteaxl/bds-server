'use strict';
var mysql = require("mysql");
var util = require("../lib/utils");
var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "123456",
    database : "reland"
});

class NewsModel {
    constructor(){
        console.log("contructor----conState: " + connection.state);
        connection.connect(function (error) {
            if(error){
                console.log("Problem with connect to database Reland");
                console.log(error);
            } else{
                console.log("Connect db success");
            }
            console.log("contructor--after connect--conState: " + connection.state);
        });
    }
    findNewsByType(newsType, callback){
        console.log("-----getNewsByType");
        connection.query("SELECT * FROM news_article",function(err,rows){
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
    }
    findRootCategory(callback){
        console.log("-----findRootCategory");
        var sql = "SELECT * FROM reland.news_article_category where cat_parent_id=0";
        connection.query(sql ,function(err,rows){
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
    }

    countAllArticleOfCat(catId, callback){
        console.log("------in findAllArticleOfCat---: " + catId);
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
            connection.query(sql ,function(err, rows){
                if (!rows){
                    rows = [];
                }
                callback(err, rows);
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
            var sql = "SELECT * FROM reland.news_article where cat_id in (" + catIdStr + ")" + limitQuery;
            console.log("findAllArticleOfCat--------sql: " + sql);
            connection.query(sql ,function(err, rows){
                if (!rows){
                    rows = [];
                }
                callback(err, rows);
            });
        };

        this.getAllChildOfCat(catId, callback1);
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

        connection.query(sql ,function(err, rows){
            if (!rows){
                rows = [];
            }
            callback(err, rows);
        });
    }
}

module.exports = NewsModel;