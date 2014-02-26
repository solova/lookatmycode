express = require 'express'
app = express()

app.set 'view engine', 'jade'
app.set 'views', 'templates'
app.use(express.static('public'))

app.get '/', (req, res) ->
  res.render 'index',
    title: 'Home'

app.listen(process.env.PORT || 8050)