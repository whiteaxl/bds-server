curl -H 'Content-Type: application/json' \
    -vX POST 'http://02:123@localhost:4984/default/_bulk_docs' \
    -d @../data/testAds_2.json