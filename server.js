var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://dbUser:dbuser1234@democrud-shard-00-00-rmlgn.mongodb.net:27017,democrud-shard-00-01-rmlgn.mongodb.net:27017,democrud-shard-00-02-rmlgn.mongodb.net:27017/test?ssl=true&replicaSet=demoCRUD-shard-0&authSource=admin&retryWrites=true"

MongoClient.connect(uri, (err, client) => {
  if(err) return console.log(err)
  db = client.db('dbUser')

  app.listen(3000, () => {
    console.log('Server running on port 3000')
  })
})

app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/show', (req,res) => {
  db.collection('data').find().toArray((err, results) => {
    if(err) return console.log(err)
    res.render('show.ejs', { data: results })
  })
})

app.post('/show', (req, res) => {
  db.collection('data').save(req.body, (err, result) => {
    if(err) return console.log(err)
    console.log('salvo no bd')
    res.redirect('/show')
  })
})

app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id
  var ObjectId = require('mongodb').ObjectID;

  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if(err) return res.send(err)
    res.render('edit.ejs', {data: result})
  })
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname
  var ObjectId = require('mongodb').ObjectID;

  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname
    }
  }, (err, result) => {
    if(err) return res.send(err)
    res.redirect('/show')
    console.log('bd atualizado')
  })
})

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id
  var ObjectId = require('mongodb').ObjectID;

  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result ) =>{
    if(err) return res.send(500,err)
    console.log('Deletado do bd')
    res.redirect('/show')
  })
})
