everyauth = require 'everyauth'
express = require 'express'
locale = require 'locale'
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


# everyauth.everymodule.findUserById( (userId, callback) ->
#     app.User.findById(userId, (err,user) ->
#     if err
#         new Error("No user by that ID")
#     else
#         callback(user)
#     )
# )

everyauth.everymodule .findUserById( (id, callback) -> callback(null, usersById[id]))

everyauth.facebook
    .appId(conf.fb.appId)
    .appSecret(conf.fb.appSecret)
    .redirectPath('/')
    .findOrCreateUser( (session, accessToken, accessTokenExtra, fbUserMetadata) ->
        usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata) if not usersByFbId[fbUserMetadata.id]
        console.log fbUserMetadata
        usersByFbId[fbUserMetadata.id]
    )

# everyauth.facebook
#   .entryPath('/auth/facebook')
#   .callbackPath('/auth/facebook/callback')
#   .scope('email')
#   .fields('id,name,email,picture')

# everyauth.password.respondToLoginSucceed( (res, user, data) ->
#     if user then this.redirect(res, data.session.redirectTo)
# ).respondToRegistrationSucceed( (res, user, data) ->
#     this.redirect(res, data.session.redirectTo)
# )

app.set 'view engine', 'jade'
app.set 'views', 'templates'
app.use(express.static('public'))

app.use(express.favicon())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.cookieParser('htuayreve'))
app.use(express.session())
app.use(everyauth.middleware())


app.get '/', (req, res) ->
    locales = new locale.Locales req.headers["accept-language"]

    res.render 'index',
        locale: lang[locales.best(supported)]

app.listen(process.env.PORT || 1337)
