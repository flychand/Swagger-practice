/*visit https://desolate-depths-37556.herokuapp.com/*/

var express     = require('express');
var bodyParser  = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var cors    = require('cors');
var ObjectId= require('mongodb').ObjectID;
const hbs = require('hbs');
var port =process.env.PORT || 3000;
var app= express();
//var url ="mongodb://localhost:27017/testdb";
var url ="mongodb://chandan:pu15352111@ds115592.mlab.com:15592/student"
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//CRUD
//create

app.use(cors());

// app.use( (request, response, next) => {
//   response.header("Access-Control-Allow-Origin", "*");
//   response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// var corsOptions = {
//   origin: 'https://editor.swagger.io',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

//app.get('/', (request, response) => response.send('Hello World!'))



hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});


/*create record*/


app.post('/create', (request, response) => {
  let body = request.body;
  console.log(body);
  MongoClient.connect(url,{ useNewUrlParser: true }, (error, db) => {
    if(error) throw error;
    var dbo = db.db("student");
    dbo.collection("stud_info").insert(body, (error, response) => {
      if(error) throw error;
      console.log("record inserted");
      db.close();
    });
  });
  response.send("data has been inserted");
});

/*read data*/
app.get('/show',(request, response) => {

  MongoClient.connect(url,{ useNewUrlParser: true }, (error, db) => {
    if(error) {
      throw error;
    }
    dbo=db.db("student");
    dbo.collection("stud_info").find().toArray( (err, result) => {
      console.log(result);
      response.send(result);
      db.close();
    });
  });
});

app.post('/findby',(request, response) => {
  var data=request.body.name;

  MongoClient.connect(url,{ useNewUrlParser: true }, (error, db) => {
    if(error) {
      throw error;
    }
    dbo=db.db("student");
    dbo.collection("stud_info").find({"name":data}).toArray( (err, result) => {
      console.log(result);
      response.send(result);
      db.close();
    });
  });
});



/*delete data by name*/
app.delete('/delete',(request, response)=>{
  var data= request.body.name;
  console.log(data);
  MongoClient.connect(url,{ useNewUrlParser: true }, (error, db)=>{
    if(error) {
      throw error;
    }
    dbo=db.db("student");

    dbo.collection("stud_info").remove({"name":data});
      db.close();

  });
  response.send(`${data} has been deleted`);
});


/*delete data by id*/
app.delete('/delete/:id',(request, response)=>{
  var data = request.params.id;
  console.log(data);
  MongoClient.connect(url,{ useNewUrlParser: true }, (error, db)=>{
    if(error) throw error;
    dbo=db.db("student");

    dbo.collection("stud_info").remove({"_id": ObjectId(data)});
      db.close();

  });
  response.send(`${data} has been deleted`);
});




app.listen(port,() =>{
  console.log(`Server on ${port}`);
});
