const express =require('express');
const mysql = require("mysql");
const { render } = require('ejs');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'project_firman',
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected...");
  }
});

// Routing Login
app.get('/login', (req, res) => {
  res.render('login', {
    pesan: ''
  });
});

app.post('/auth/login', (req, res) => {
  const {email, password} = req.body;
  
  if (!email || !password) {
    return res.render('login', {
      pesan: 'Email dan Password harus di isi'
    })
  }
  db.query('SELECT * FROM users WHERE email = ?', 
      [email],
      (error, results) => {
          console.log(results[0].password);
          if (email != results[0].email || password != results[0].password) {
              res.render('login', {
                  pesan: 'Email atau Password kamu salah'
              })
          } else {
              res.send('Kamu berhasil Login')
          }
      });
  });

  // Routing register
  app.get('/register', (req, res) => {
    res.render('register', {
      pesan: ''
    });
  });

  app.post('/auth/register', (req, res) => {
    const {nama, email, password} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', 
    [email],
    (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                pesan: 'Email yang kamu gunakan sudah ada'
            })
        } else if(password.length <= 5) {
            return res.render('register', {
                pesan: 'Password harus lebih dari 5 character'
            })
        }

        db.query('INSERT INTO users SET ?', 
        {nama: nama, email: email, password: password}, 
        (error) => {
            if(error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    pesan: 'Kamu berhasil membuat akun'
                })
            }
        })


    });
  });

app.listen(5000);