/**
 * # User.js
 *
 * The user document for Mongoose
 *
 */
'use strict';
/**
 * ## Imports
 *
 */
//Mongoose - the ORM
var Mongoose = require('mongoose'),
    //The document structure definition
    Schema = Mongoose.Schema;

//Same fields as Parse.com 
var AdsSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },

  detail_duAn: {
    type: String
  },
  detail_diaChi: {
    type: String
  },
  detail_maSo: {
    type: String
  },
  detail_loaiTinRao: {
    type: String
  },
  detail_ngayDangTin: {
    type: String
  },
  detail_ngayHetHan: {
    type: String
  },
  detail_soPhongNgu: {
    type: String
  },
  //cust
  cust_phone: {
    type: String
  },
  cust_mobile: {
    type: String
  },
  cust_dangBoi: { //dang boi 
    type: String
  },
  cust_email: {
    type: String
  },

  price_value:{
    type: String
  },
  price_unit:{
    type: String
  },
  area:{
    type: String
  },
  area_full:{
    type: String
  },
  
  loc:{
    type: String
  }, 
  //images:
  images_small: [String]
});

/**
 * ## Mongoose model for User 
 *
 * @param UserSchema - the document structure definition
 *
 */
var ads = Mongoose.model('Ads', AdsSchema);

module.exports = ads;
