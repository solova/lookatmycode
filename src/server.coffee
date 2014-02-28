everyauth = require 'everyauth'
express = require 'express'
locale = require 'locale'
fs = require 'fs'
_ = require 'lodash'

supported = new locale.Locales(["ru", "en"])

app = express()

everyauth.debug = true

# everyauth.everymodule.findUserById( (id, callback) -> callback(null, usersById[id]))

nextUserId = 0
usersById = {}
usersByFbId = {}
addUser = (source, sourceUser) ->
    user = usersById[++nextUserId] = id: nextUserId
    user[source] = sourceUser
    user


everyauth.everymodule .findUserById( (id, callback) -> callback(null, usersById[id]))

everyauth.facebook
    .appId(conf.fb.appId)
    .appSecret(conf.fb.appSecret)
    .redirectPath('/')
    .findOrCreateUser( (session, accessToken, accessTokenExtra, fbUserMetadata) ->
        usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata) if not usersByFbId[fbUserMetadata.id]
        usersByFbId[fbUserMetadata.id]
    )

app.set 'view engine', 'jade'
app.set 'views', 'templates'
app.use(express.static('public'))

app.use(express.favicon())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.cookieParser('htuayreve'))
app.use(express.session())
app.use(everyauth.middleware())

defaults =
    title: "New Code"
    code: ""
    author: null
    lang: "javascript",
    created: new Date(),
    views: 0


guid = ->
    s = []
    hexDigits = "0123456789abcdef"
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1) for i in [0..16]
    s.join("")

app.get '/', (req, res) ->
    locales = new locale.Locales req.headers["accept-language"]
    res.render 'index', locale: lang[locales.best(supported)], code:defaults

app.get '/about', (req, res) ->
    locales = new locale.Locales req.headers["accept-language"]
    res.render 'page', locale: lang[locales.best(supported)], body: lang[locales.best(supported)].aboutpage

app.get '/changelog', (req, res) ->
    locales = new locale.Locales req.headers["accept-language"]
    res.render 'page', locale: lang[locales.best(supported)], body: lang[locales.best(supported)].changelogpage

app.post '/code', (req, res) ->
    model = req.body
    model.id = guid()
    model.author = req.session.auth.facebook.user.name

    fs.writeFile "#{__dirname}/codes/#{model.id}.json", JSON.stringify(model), (err) ->
    res.json(model)

app.put '/code/:id', (req, res) ->
    id = req.params.id
    if id then fs.writeFile "#{__dirname}/codes/#{id}.json", JSON.stringify(req.body), (err) ->
    model = req.body
    model.author = req.session.auth.facebook.user.name
    res.json(model)

app.get '/:id', (req, res) ->
    locales = new locale.Locales req.headers["accept-language"]
    id = req.params.id
    if id then fs.readFile "#{__dirname}/codes/#{id}.json", (err, data) ->
        data = JSON.parse data
        data.views++
        fs.writeFile "#{__dirname}/codes/#{id}.json", JSON.stringify(data), (err) ->
        res.render 'index', locale: lang[locales.best(supported)], code: data


app.listen(process.env.PORT || 1337)
