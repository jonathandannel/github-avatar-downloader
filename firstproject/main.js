var repositoryOwner = process.argv.slice(2)[0];
var repositoryName = process.argv.slice(2)[1];

var fs = require('fs');
var request = require('request');
var GITHUB_TOKEN = require('./secrets.js')

var options = {
  url: 'https://api.github.com/repos/' + repositoryOwner + '/' + repositoryName +'/contributors',
  headers: {
    'User-Agent': 'jonathandannel',
    'Authorization': GITHUB_TOKEN
  }
}

var saveAvatar = function(img, name) {
  request.get(img)
         .on('response', function() {
           process.stdout.write('Downloading avatar for user => ' + name + '\n');
         })
         .pipe(fs.createWriteStream('./avatars/' + name + '.png'))
};

var getAvatars = function(options, save) {
  request.get(options, function(error, response, body) {
    if (error) {
      console.log("Error! Aborting.");
      throw err;
    } else {
      var rawData = JSON.parse(body);
      rawData.forEach(function(element) {
        var avatarUrl = element.avatar_url;
        var avatarName = element.login;
        saveAvatar(avatarUrl, avatarName);
      });
    }
  });
}

getAvatars(options, saveAvatar);
