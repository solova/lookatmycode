var app, express;

express = require('express');

app = express();

app.set('view engine', 'jade');

app.set('views', 'templates');

app.use(express["static"]('public'));

app.get('/', function(req, res) {
  return res.render('index', {
    title: 'Home'
  });
});

app.listen(process.env.PORT || 8050);
