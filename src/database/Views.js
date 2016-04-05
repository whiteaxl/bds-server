//all_ads

function (doc, meta) {
  if (doc._type=='Ads')
    emit(doc.title, doc);
}

// view , ddoc=ads_spatial, viewname=points

function (doc) {
  if (doc.place && doc.place.geo) {
    var geojson = {
      type: "Point",
      coordinates : [doc.place.geo.lon, doc.place.geo.lat]
    };
    emit([geojson], doc);
  }
}


//ddoc=place, all_places
function (doc, meta) {
    if (doc._type=='Place')
        emit(doc.placeID, doc);
}
