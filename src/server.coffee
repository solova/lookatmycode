express = require 'express'
locale = require 'locale'
_ = require 'lodash'

supported = new locale.Locales(["ru", "en"])

app = express()

app.set 'view engine', 'jade'
app.set 'views', 'templates'
app.use(express.static('public'))

app.get '/', (req, res) ->
    locales = new locale.Locales req.headers["accept-language"]

    res.render 'index',
        locale: lang[locales.best(supported)]

app.listen(process.env.PORT || 8050)
