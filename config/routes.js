const axios = require('axios');
const bcrpyt = require('bcryptjs')
const { authenticate } = require('../auth/authenticate');
const jwt = require('jsonwebtoken');
const secrets = require('./secrets.js')

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

const Routes = require('./routes-model.js')

function register(req, res) {
  // implement user registration -- working
  let user = req.body;
  const hash = bcrpyt.hashSync(user.password, 10);
  user.password = hash

  Routes.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
}

function login(req, res) {
  // implement user login -- working 
  let {username, password} = req.body;
  
  // console.log(req.body)
  Routes.findBy({username})
   .first()
   .then(user => {
     //console.log(user);
     if(user && bcrpyt.compareSync(password, user.password)){
       const token = generateToken(user);
       res.status(200).json({
         message: `Welcome ${user.username}!, please take the token and do not let it get taken`,
         token
       });
     } else {
       res.status(401).json({message: 'Invalid Credentials'});
     }
   })
   .catch(error => {
     console.log(error)
     res.status(500).json(error);
   })
}

//getJokes endpoint is working after implementing log in end point -- checked

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}
