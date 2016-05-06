//all_ads

function (doc, meta) {
  if (doc.type=='Ads')
    emit(doc.adsID, doc);
}

// view , ddoc=ads_spatial, viewname=points

function (doc) {
  if (doc.place && doc.place.geo && doc.place.geo.lon && doc.place.geo.lat) {
    var geojson = {
      type: "Point",
      coordinates : [doc.place.geo.lon, doc.place.geo.lat]
    };
    emit([geojson], doc);
  }
}


//ddoc=place, all_places
function (doc, meta) {
    if (doc.type=='Place')
        emit(doc.placeID, doc);
}
