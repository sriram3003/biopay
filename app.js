//---------- Server, rendering, routing libraries *DO NOT CHANGE*---------------------------
const express = require("express");
const bodyParser = require("body-parser");
const handlebars = require('express-handlebars'); // handlebar 
const path = require('path')
const hbs = require('hbs')
const router = express.Router();
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); 
app.use(express.static(path.join(__dirname, 'public')));
var fs= require('fs'); // for json filed
const dataPath = './table.json';

// Cookie creation, encryption and decryption //
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const cookieParser = require('cookie-parser');
app.use(cookieParser())
const jwt_decode = require('jwt-decode');

// DB connections
const mysql= require ('mysql');
const dbconnect = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Welcome@123',
    database: 'biopayv1',
    multipleStatements: true // for multiple statements
  });
dbconnect.connect(function (err){
    if (err) throw err;
    console.log("Connected")
});

//-----------Handlebar configurations-------------
app.engine('hbs', handlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

//------------ Routing----------------------------

//app.use('/', require('../routes'));

////////// LOGIN UP PAGE /////////////

app.get('/login', (req, res) => {
    res.status(200).render('login');
  });

app.post('/profile', function (req, res) {
	var useremail = req.body.email;
	var password = req.body.psw;
	if (useremail && password) {
		dbconnect.query('SELECT * FROM customerdetails WHERE email = ? AND pws = ?', [useremail, password], function(error, results) {
      if ((results.length)== 0) {
        console.log(results.length)
        res.redirect('/error')
        //res.status(401).render('login',{msg:'Incorrect credentials'});
			} 
      else {
        //console.log(results[0].CHname);
        const id = results[0].CHID;
        //console.log(id);
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });
  
        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1 * 5 * 60 * 1000
          ),
          httpOnly: true
        };
        res.cookie('biopay', token, cookieOptions);
        //res.status(200).render('profile', { msg:results[0].CHname}) // Code if the display doesnt work
        //console.log(req.cookies.jwt)
       dbconnect.query('SELECT * FROM carddetails WHERE CHID = ? ', [id], function(error, results1) {
          if (error) {
            res.redirect('/error')
            //res.status(401).render('login',{msg:'Incorrect credentials'});
          } 
          else{
            console.log(results1)
            res.status(200).render('profile', { msg:results[0].CHname , tables: results1})
            
            // Card details in JSON
            fs.writeFile('table.json', JSON.stringify(results1), function (err) {
              if (err) throw err;
              console.log('Saved!');
            });
          }
        })
        
			}			
      
      // if (req.cookies.biopay){
      //   var decoded = jwt_decode(req.cookies.biopay);
      //   var id= decoded['id']
      //   dbconnect.query('SELECT * FROM carddetails WHERE CHID = ? ', [id], function(error, results) {
      //     // add error conditions
      //     if ((results.length)== 0) {
      //       res.redirect('/error')
      //       res.status(401).render('login',{msg:'Incorrect credentials'});
      //     } 
      //     else{
      //       console.log(results)
      //       res.status(200).render('profile',{ tables: results })
      //     }
      //   })
      // }

		});
	} 
  else {
		res.status(401).render('login',{msg:'Enter the credentials'});
	}
});

// Incorrect credentials
app.get('/error', function(req, res) 
{
res.status(401).render('login',{msg:'Incorrect credentials'});
const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1 * 1 * 2 * 1000
  ),
  httpOnly: true
};
res.cookie('biopay','Youcant read thecookie',cookieOptions);

});


////////// SIGN UP PAGE /////////////
app.get('/signup', function(req, res) 
{
    res.status(200).render('signup');
  });

app.post('/registration-successful', function (req, res) {
    var ins = "INSERT INTO `Customerdetails`(`CHname`,`email`, `dob`, `pws`,`phonenumber`) VALUES ('"+req.body.FullName+"','"+req.body.email+"','"+req.body.DOB+"', '"+req.body.psw+"', '"+req.body.phonenumber+"' )";

    dbconnect.query(ins, function(err,rows,fields){
        if (err) 
        {
          console.log(err);
          res.status(401).render('error',{msg: 'Error in data. Please re-enter the fields correctly'} ) // Unauthorised request
        }
        else{
          res.status(200).render('signupsuccessful', { msg:'Data added successfully' })
          console.log('data inserted successfully');
        }

    })


  })
// Card addition page
app.get('/addcard', (req,res)=>{
    if (req.cookies.biopay) res.render('Addcard');
    
    else res.redirect('/login')
})

// Card adddtion in DB
app.post('/cardsuccess',(req,res)=>{
   if (req.cookies.biopay)
   {
    var decoded = jwt_decode(req.cookies.biopay);
    //console.log(decoded['id']);
    var CHID= decoded['id']
   }
   else res.redirect('/error')

  var ins1 = "INSERT INTO `carddetails`(`CHID`,`cardTitle`,`cardName`, `cardNumber`,`month`, `year`,`cvv`) VALUES ('"+CHID+"','"+req.body.cardTitle+"','"+req.body.cardname+"','"+req.body.cardnumber+"','"+req.body.Month+"', '"+req.body.Year+"', '"+req.body.cvv+"' )";

  dbconnect.query(ins1, function(err,rows,fields){
    if (err) 
    {
      console.log(err);
      res.status(401).render('error',{msg: 'Error in data. Please re-enter the fields correctly'} ) // Unauthorised request
    }
    else{
      res.status(200).render('cardsuccess', { msg:'Card Data added successfully' })
      console.log('data inserted successfully');
      //res.redirect('/profile');
    }

})
})

// Get profile

app.get('/profile',(req,res)=>{

  if (req.cookies.biopay)
  {
   var decoded = jwt_decode(req.cookies.biopay);
   //console.log(decoded['id']);
   var CHID= decoded['id']
  }
  dbconnect.query('SELECT * FROM carddetails WHERE CHID = ? ', [CHID], function(error, results1) {
    if ((results1.length)== 0) {
      res.redirect('/error')
      //res.status(401).render('login',{msg:'Incorrect credentials'});
    } 
    else{
      console.log(results1)
      res.status(200).render('profile', { msg:results1[0].CHname , tables: results1})
      
      // Card details in JSON
      fs.writeFile('table.json', JSON.stringify(results1), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    }
  })

})

// Delete card
app.get('/delete/:id', function(req, res, next) {
  var id= req.params.id;
    var sql = 'DELETE FROM carddetails WHERE cardID = ?';
    dbconnect.query(sql, [id], function (err, data) {
    if (err) throw err;
    console.log("Working");
  });
  res.redirect('/profile');
});

// log out
app.get('/logout',(req,res)=>{
  res.status(200).render('logout',{msg:'You have been logged out successfully'});
  //res.clearCookie('biopay');
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1 * 1 * 2 * 1000
    ),
    httpOnly: true
  };
  res.cookie('biopay','Youcant read thecookie',cookieOptions);
  
})

//json url
app.get('/users', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    res.setHeader("Access-Control-Allow-Origin", "*"); //CORS

    res.send(JSON.parse(data));
    
   
  });
});


//subscription
app.get('/subscription', function(req, res) {

  res.status(200).render('subscription');
});

//webcamera
app.get('/webcamera', function(req, res) {

  res.status(200).render('webcamera');
});

//webcam-extension
app.get('/webcamextension',function(req,res){
res.status(200).render('webcamextension')
});


// port opening
app.listen(port, () => console.log("Running successfully"));