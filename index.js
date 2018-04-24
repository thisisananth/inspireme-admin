var express = require('express');
var app = express();
var fs = require('fs');
var csv = require("fast-csv");
const Datastore = require('@google-cloud/datastore');
const projectId = 'inspireme-52933';
const datastore = new Datastore({
    projectId: projectId,
  });
  const kind = 'quote';  


app.get('/readQuotes', function (req, res) {
 const stream= fs.createReadStream("quotes.csv")
 csv
 .fromStream(stream, {headers : true})
 .on("data", function(qData){
    let name = 'quote_'+qData.id;
    let quoteKey = datastore.key([kind,name]);
    let quote = {
        key : quoteKey,
        data :{
            quote : qData.quote,
            author : qData.author,
            comments: qData.comments,

        },
    };
    datastore
  .save(quote)
  .then(() => {
    console.log(`Saved ${quote.key.name}: ${quote.data.quote}`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
 })
 .on("end", function(){
     console.log("done");
 });
//stream.pipe(csv);
 res.send("Read quotes completed");
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));
