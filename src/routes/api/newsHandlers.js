'use strict';
var Boom = require('boom');

var QueryOps = require('../../lib/QueryOps');
var logUtil = require("../../lib/logUtil");
var util = require("../../lib/utils");
var NewsModel = require('../../dbservices/News');
var newsModel = new NewsModel();

var http = require('http');
var https = require('https');
var services = require("../../lib/services");
var constant = require("../../lib/constant");
var danhMuc  = require("../../lib/DanhMuc");

var internals = {};

internals.countNews = function(req, reply) {
    var callback =(err,rows) => {
        var countArticle = 0;
        if(err){
            console.log("---countNews---err: " + err);
        } else{
            if (rows && rows.length > 0)
                countArticle = rows[0].countArticle;
            console.log("------countNews------success");
            console.log(rows);
        }
        reply({
            countArticle: countArticle
        });
    };
    var query = req.payload;
    if (!query.hasOwnProperty('catId')) {
        reply(Boom.badRequest());
    } else {
        var catId =  query.catId;
        console.log("--------newsHandler---catId: " + catId);
        newsModel.countAllArticleOfCat(catId, callback);
    }
};

internals.findNews = function(req, reply) {
    var query = req.payload;
    console.log("-----------hander: Find News");
    var callback =(err,all) => {
        if(err){
            console.log("err: " + err);
        } else{
            if (!all)
                all = [];
            console.log("-----findNews--success");
            console.log("size:" + all.length);
            var result = [];
            if(all.length > 0){
                for(var i=0; i < all.length; i++){
                    result.push(_transformArticleNews(all[i]));
                }
            }
            reply({
                length: result.length,
                list: result
            });
        }
    };
    if (!query.hasOwnProperty('catId') && !query.hasOwnProperty('pageNo') && !query.hasOwnProperty('pageSize')) {
        reply(Boom.badRequest());
    } else {
        newsModel.findAllArticleOfCat(query.catId, query.pageNo, query.pageSize, callback);
    }
};
internals.findRootCategory = function(req, reply) {
    var callback =(err,all) => {
        if(err){
            console.log("err: " + err);
        } else{
            if (!all)
                all = [];
            console.log("size:" + all.length);
            console.log("Error:" + err);
            reply({
                length: all.length,
                list: all
            });
        }
    };
    newsModel.findRootCategory(callback);
};

function _transformArticleNews(article) {
    let atc = {};
    atc.articleId = article.article_id;
    atc.catId = article.cat_id;
    atc.metaKeywords = article.meta_keywords;
    atc.metaDesc = article.meta_desc;
    atc.topicId = article.topic_id;
    atc.thumbLarge = article.thumb_large;
    atc.thumbSmall = article.thumb_small;
    atc.thumbIcon = article.thumb_icon;
    atc.title = util.locHtml(article.title);
    atc.titleCode = article.title_code;
    atc.contentDesc = util.locHtml(article.content_desc);
    atc.contentUrl = article.content_url;
    atc.posterId = article.poster_id;
    atc.checkerId = article.checker_id;
    if(article.posted_date > 0){
        let date = new Date(article.posted_date);
        atc.postedDate = date.toUTCString();
    }
    atc.isHot = article.is_hot;
    atc.articleType = article.article_type;
    atc.pageCounter = article.page_counter;
    atc.enabled = article.enabled;
    atc.archived = article.archived;
    atc.ratingMarks = article.rating_marks;
    atc.ratingCount = article.rating_count;
    atc.avatarImage = "asset/img/data/img-40-1.jpg";
    if(article.thumb_large != null && article.thumb_large.trim().length > 0){
        atc.avatarImage = article.thumb_large;
    } else if(article.thumb_small != null && article.thumb_small.trim().length > 0){
        atc.avatarImage = article.thumb_small;
    } else if(article.thumb_icon != null && article.thumb_icon.trim().length > 0){
        atc.avatarImage = article.thumb_icon;
    }

    return atc;
}

module.exports = internals;