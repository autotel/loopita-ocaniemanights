var fs = require('fs');

console.log("this node script generates the audio loops database. ");

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/audio");
    process.exit(-1);
}

var path = process.argv[2];

var fileList=[];
fs.readdir(path, function(err, items) {
    console.log(items);
    for (var i=0; i<items.length; i++) {
      fileList.push({
        "name":items[i],
        "source":path+"/"+items[i]
      });
      console.log(items[i]);
    }
    fs.writeFile(path+"/database.json", JSON.stringify(fileList), function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The file was saved to "+path+"/database.json");
    });
});
