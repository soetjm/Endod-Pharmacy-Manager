const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./utils/dbconnection.js");
const BookLog = require("./models/booklog.js");
const Dispensary = require("./models/dispensary.js");
const DisposableMedicine =require('./models/disposablemedicine.js');
const Employee = require('./models/employee.js');
const Medicine = require('./models/medicine.js');
const Pharmaciy = require('./models/pharmacy.js');
const PurchaseLog = require('./models/purchaselog.js');
const PurchaseRequest = require('./models/purchaserequest.js');
const Sales = require('./models/sales.js');
const StockRequest = require('./models/stockrequest.js');
const Supplier = require('./models/supplier.js');
const TransferLog = require('./models/transferlog.js');
const TransferRequest = require('./models/transferrequest.js');
const UserAccount = require('./models/useraccount.js');
const UserLog = require('./models/userlog.js');
const UserRole = require('./models/userrole.js');

const dbFuncRout = require('./routes/dbFunc.js');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({express:true}));


const port = process.env.PORT || 5500;

app.use(dbFuncRout);

// Define associations
// Medicine.hasMany(Sales, {
//   foreignKey: 'drugcode',
//   sourceKey: 'drugcode',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });
// Sales.belongsTo(Medicine, {
//   foreignKey: 'drugcode',
//   targetKey: 'drugcode',
// });

Sales.hasOne(BookLog, {
  foreignKey: 'salesid',
  sourceKey: 'salesid',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
BookLog.belongsTo(Sales, {
  foreignKey: 'salesid',
  targetKey: 'salesid',
});

// Sales.hasMany(BookLog, {
//   foreignKey: 'drugcode',
//   sourceKey: 'drugcode',
//   constraints: false, 
// });
// BookLog.belongsTo(Sales, {
//   foreignKey: 'drugcode',
//   targetKey: 'drugcode',
//   constraints: false,
// });

//---------------------------------------------------------
// Medicine.hasMany(PurchaseRequest, {
//   foreignKey: 'drugcode',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

// PurchaseRequest.belongsTo(Medicine, {
//   foreignKey: 'drugcode',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

// //---------------------------------------------------------

// DisposableMedicine.belongsTo(Medicine, {
//   foreignKey: 'drugcode', 
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });


// Medicine.hasMany(DisposableMedicine, {
//   foreignKey: 'drugcode',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });


//-------------------------------------------------------------

// Employee.belongsTo(UserAccount, {
//   foreignKey: 'username',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });
// UserAccount.hasMany(Employee, {
//   foreignKey: 'username',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

// //---------------------------------------------------------------

// StockRequest.belongsTo(Medicine, {
//   foreignKey: 'drugcode',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });
// Medicine.hasMany(StockRequest, {
//   foreignKey: 'drugcode',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

// //----------------------------------------------------------------

// TransferRequest.belongsTo(Medicine, {
//   foreignKey: 'drugcode',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });
// Medicine.hasMany(TransferRequest, {
//   foreignKey: 'drugcode',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });


// //-----------------------------------------------------------


// UserRole.belongsTo(UserAccount, {
//   foreignKey: 'username',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });
// UserAccount.hasMany(UserRole, {
//   foreignKey: 'username',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

//------------------------------------------------------------
// UserLog.belongsTo(UserAccount, {
//   foreignKey: 'username',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });
// UserAccount.hasMany(UserLog, {
//   foreignKey: 'username',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

//-------------------------------------------------------------


sequelize.sync({
  force: true,
  alter : true
}) // Ensures tables are created
.then(() => {
  app.listen(port);
  console.log('Database synchronized successfully');
})
.catch((error) => {
  console.error('Error synchronizing the database:', error);
});




