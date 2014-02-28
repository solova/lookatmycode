var conf;

conf = {
  fb: {
    appId: "625598667514068",
    appSecret: "1e60173b3db3c0acf306943122fdbdff"
  }
};

var lang;

lang = {
  en: {
    "about": "About",
    "source": "Source",
    "changelog": "Change log",
    "motto": "create, share, like, comment",
    "fork": "Fork",
    "download": "Download",
    "like": "Like",
    "likes": "likes",
    "like1": "like",
    "views": "views",
    "view1": "view",
    "newcode": "New Code",
    "save": "Save",
    "aboutpage": "LookAtMyCode is a system where you can store text for a certain period of time. The system is mainly used by programmers to store, share and like pieces of sources code",
    "changelogpage": "<ul><li>1.0 - init version</li></ul>",
    "created": "Created by"
  },
  ru: {
    "about": "О проекте",
    "source": "Исходные коды",
    "changelog": "История изменений",
    "motto": "создавай, делись, одобряй, комментируй",
    "fork": "Ответвиться",
    "download": "Скачать",
    "like": "Одобряю",
    "likes": "одобрений",
    "like1": "одобрение",
    "views": "просмотров",
    "view1": "просмотр",
    "newcode": "Новый код",
    "save": "Сохранить",
    "aboutpage": "LookAtMyCode &mdash; это система для публикации, комментирования и исследования исходных кодов. Система может быть развёрнута в рамках компании или использоваться в глобальной сети интернет.",
    "changelogpage": "<ul><li>1.0 - первая версия</li></ul>",
    "created": "Создал"
  }
};

var addUser, app, defaults, everyauth, express, fs, guid, locale, nextUserId, supported, usersByFbId, usersById, _;

everyauth = require('everyauth');

express = require('express');

locale = require('locale');

fs = require('fs');

_ = require('lodash');

supported = new locale.Locales(["ru", "en"]);

app = express();

everyauth.debug = true;

nextUserId = 0;

usersById = {};

usersByFbId = {};

addUser = function(source, sourceUser) {
  var user;
  user = usersById[++nextUserId] = {
    id: nextUserId
  };
  user[source] = sourceUser;
  return user;
};

everyauth.everymodule.findUserById(function(id, callback) {
  return callback(null, usersById[id]);
});

everyauth.facebook.appId(conf.fb.appId).appSecret(conf.fb.appSecret).redirectPath('/').findOrCreateUser(function(session, accessToken, accessTokenExtra, fbUserMetadata) {
  if (!usersByFbId[fbUserMetadata.id]) {
    usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata);
  }
  return usersByFbId[fbUserMetadata.id];
});

app.set('view engine', 'jade');

app.set('views', 'templates');

app.use(express["static"]('public'));

app.use(express.favicon());

app.use(express.json());

app.use(express.urlencoded());

app.use(express.cookieParser('htuayreve'));

app.use(express.session());

app.use(everyauth.middleware());

defaults = {
  title: "New Code",
  code: "",
  author: null,
  lang: "javascript",
  created: new Date(),
  views: 0
};

guid = function() {
  var hexDigits, i, s, _i;
  s = [];
  hexDigits = "0123456789abcdef";
  for (i = _i = 0; _i <= 16; i = ++_i) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  return s.join("");
};

app.get('/', function(req, res) {
  var locales;
  locales = new locale.Locales(req.headers["accept-language"]);
  return res.render('index', {
    locale: lang[locales.best(supported)],
    code: defaults
  });
});

app.get('/about', function(req, res) {
  var locales;
  locales = new locale.Locales(req.headers["accept-language"]);
  return res.render('page', {
    locale: lang[locales.best(supported)],
    body: lang[locales.best(supported)].aboutpage
  });
});

app.get('/changelog', function(req, res) {
  var locales;
  locales = new locale.Locales(req.headers["accept-language"]);
  return res.render('page', {
    locale: lang[locales.best(supported)],
    body: lang[locales.best(supported)].changelogpage
  });
});

app.post('/code', function(req, res) {
  var model;
  model = req.body;
  model.id = guid();
  model.author = req.session.auth.facebook.user.name;
  fs.writeFile("" + __dirname + "/codes/" + model.id + ".json", JSON.stringify(model), function(err) {});
  return res.json(model);
});

app.put('/code/:id', function(req, res) {
  var id, model;
  id = req.params.id;
  if (id) {
    fs.writeFile("" + __dirname + "/codes/" + id + ".json", JSON.stringify(req.body), function(err) {});
  }
  model = req.body;
  model.author = req.session.auth.facebook.user.name;
  return res.json(model);
});

app.get('/:id', function(req, res) {
  var id, locales;
  locales = new locale.Locales(req.headers["accept-language"]);
  id = req.params.id;
  if (id) {
    return fs.readFile("" + __dirname + "/codes/" + id + ".json", function(err, data) {
      data = JSON.parse(data);
      data.views++;
      fs.writeFile("" + __dirname + "/codes/" + id + ".json", JSON.stringify(data), function(err) {});
      return res.render('index', {
        locale: lang[locales.best(supported)],
        code: data
      });
    });
  }
});

app.listen(process.env.PORT || 1337);
