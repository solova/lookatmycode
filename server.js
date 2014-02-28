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
    "save": "Save"
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
    "save": "Сохранить"
  }
};

var addUser, app, everyauth, express, locale, nextUserId, supported, usersByFbId, usersById, _;

everyauth = require('everyauth');

express = require('express');

locale = require('locale');

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
  console.log(fbUserMetadata);
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

app.get('/', function(req, res) {
  var locales;
  locales = new locale.Locales(req.headers["accept-language"]);
  return res.render('index', {
    locale: lang[locales.best(supported)]
  });
});

app.listen(process.env.PORT || 1337);
