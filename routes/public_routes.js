const UserController = require('../controllers/user_controller');

const allowedOrigins = ['https://54.228.42.199','https://34.241.115.67','https://54.78.134.111','https://langucards.herokuapp.com'];
// const corsOptionsDelegate = function (req, callback) {
//     var corsOptions;
//     if (allowedOrigins.indexOf(req.header('Origin')) !== -1) {
//       corsOptions = { origin: true, maxAge: 86400, methods: 'GET, PUT, POST', allowedHeaders: 'Content-Type, Authorization' }
//     } else {
//       corsOptions = { origin: false }
//     }
//     callback(null, corsOptions)
//   }



module.exports = (app) => {
    //app.options('*', cors(corsOptionsDelegate), (req, res) => { res.setHeader("Content-Type", "application/json"); res.sendStatus(200); });
    
    app.post('/register', UserController.createUser);
    app.post('/login', UserController.authenticateUser);
    // THINK OF API ENDPOINT ORGANIZATION
    
}