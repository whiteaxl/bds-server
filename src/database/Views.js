//all_ads

function (doc, meta) {
  if (doc._type=='Ads')
    emit(doc.title, doc);
}

// search 
