'use strict';

let d = require("./dataUtils");
let program = null;

if (process.argv.length <= 2) {
  console.error("Usage: node runDataUtils.js [dup|img]")
}

program = process.argv[2];

if (program == "dup")  {
  d.checkDuplicate(() => {
    process.exit(0);
  });
} else if (program == "img")  {
  d.downloadAllAdsImage("/u01/images", () => {
    process.exit(0);
  });
} else {
  console.error("parameter: img|dup");
}




