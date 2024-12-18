const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./utils/dbconnection.js");
const dbFuncRout = require('./routes/dbFunc.js');
const defineAssociations = require('./models/assosiation.js');
const {
  PurchaseRequest,
  PurchaseLog,
  TransferRequest,
  TransferLog,
  BookLog,
  Medicine,
  Sales,
  StockRequest,
  Dispensary,
  DisposableMedicine,
  Employee,
  UserAccount,
  UserLog,
  UserRole,
 } = defineAssociations(sequelize);

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({express:true}));


const port = 3000;

app.use(dbFuncRout);


sequelize.sync({}) // Ensures tables are created
.then(() => {
  app.listen(port);
  console.log('Database synchronized successfully');
})
.catch((error) => {
  console.error('Error synchronizing the database:', error);
});




