'use strict';
var Boom = require('boom');

var QueryOps = require('../../lib/QueryOps');
var logUtil = require("../../lib/logUtil");
var util = require("../../lib/utils");
var NewsService = require('../../dbservices/News');
var http = require('http');
var https = require('https');
var services = require("../../lib/services");
var constant = require("../../lib/constant");
var danhMuc  = require("../../lib/DanhMuc");

var newsService = new NewsService();

var internals = {};

internals.getNews = function(req, reply) {
    var query = req.payload;
    console.log("Find News:", query);
    if (!query.hasOwnProperty('loaiTinTuc')) {
        reply(Boom.badRequest());
    } else {
        var loaiTinTuc =  query.loaiTinTuc;
        newsService.getAds(loaiTinTuc, (err, result) => {
            if (err) {
                console.log("Erorr when getting detail data:", err);
                if (err.code === 13) {
                    reply({
                        status : constant.STS.SUCCESS
                    })
                } else {
                    reply(Boom.badImplementation("Error when getting detail for asdID: " + adsID));
                }

                return;
            }

            var ads = result.value;

            ads = _transformDetailAds(ads);
            reply({
                ads: ads,
                status : constant.STS.SUCCESS
            });
        });
    }
};
