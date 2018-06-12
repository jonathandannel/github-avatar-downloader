require('dotenv').config()
var fs = require('fs');
var request = require('request');

var repositoryOwner = process.argv.slice(2)[0];
var repositoryName = process.argv.slice(2)[1];

var options = {
  url: 'https://api.github.com/repos/' + repositoryOwner + '/' + repositoryName +'/contributors',
  headers: {
    'User-Agent': 'jonathandannel',
    'Authorization': process.env.GITHUB_TOKEN
  }
}

var saveAvatar = function(url, name) {
  request.get(url)
         .on('response', function() {
           process.stdout.write('Downloading avatar for user => ' + name + '\n');
         })
         .pipe(fs.createWriteStream('./avatars/' + name + '.png'))
};

var getAvatars = function(options, save) {
  request.get(options, function(error, response, body) {
    if (error) {
      console.log('ERROR: ' + response.statusCode);
      throw err;
    } else {
      var rawData = JSON.parse(body);
      rawData.forEach(function(element) {
        saveAvatar(element.avatar_url, element.login);
      })
    }
  });
}

process.argv.slice(2).length === 2 ? getAvatars(options, saveAvatar) : console.log("ERROR: Only 2 arguments allowed: 'REPO_OWNER', 'REPO_NAME'");
