'use strict';

var JWT    = require('jsonwebtoken');
var fs = require('fs');
var multiparty = require('multiparty');

var ChatService = require("../../lib/ChatHandler");

var expiryTime = 8;

var internals = {};

function baseName(str)
{
   var base = new String(str).substring(str.lastIndexOf('/') + 1);     
   return base;
}

// Size Conversion
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i]; 
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};


internals.uploadFiles = function(req,reply){
	var form = new multiparty.Form();
	form.parse(req.payload, function(err, fields, files) {
		
		console.log(files);

		
    	var newFileMaps = [];

		var fp = files[Object.keys(files)[0]][0].path;
		var ofn = files[Object.keys(files)[0]][0].originalFilename; 
		var fsize = files[Object.keys(files)[0]][0].size; 
		var newpath = __dirname + "/../../web/upload/"+ofn;
		
		fs.readFile(fp,function(err,data){
			
			console.log("saving to " + newpath);

			fs.writeFile(newpath,data,function(err){
				if(err) console.log(err);
				else console.log("succesful save " + newpath);
				
			})
		});
		console.log("Fields are" + JSON.stringify(fields));
		var data = { 
				url : "/web/upload/" + baseName(newpath), 
				name : ofn,
				size : bytesToSize(fsize),
				showme : fields.showme,
				dwimgsrc : fields.dwimgsrc,
				dwid : fields.dwid
		};
		console.log("data are  " + JSON.stringify(data));
		reply({
			success: true,
			file: data 
		});

	});

}

module.exports = internals;