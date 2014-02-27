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
    "view1": "view"
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
    "view1": "просмотр"
  }
};

var app, express, locale, supported, _;

express = require('express');

locale = require('locale');

_ = require('lodash');

supported = new locale.Locales(["ru", "en"]);

app = express();

app.set('view engine', 'jade');

app.set('views', 'templates');

app.use(express["static"]('public'));

app.get('/', function(req, res) {
  var locales;
  locales = new locale.Locales(req.headers["accept-language"]);
  return res.render('index', {
    locale: lang[locales.best(supported)]
  });
});

app.listen(process.env.PORT || 8050);
