const { DataType } = require('sequelize');

module.exports = (sequelize) => {
    // const PurchaseRequest = require('./purchaserequest')(sequelize);
    // const PurchaseLog = require('./purchaselog')(sequelize);
    // const TransferRequest = require('./transferrequest')(sequelize);
    // const TransferLog = require('./transferlog')(sequelize);

    const BookLog = require("./booklog.js");
    const Dispensary = require("./dispensary.js");
    const DisposableMedicine =require('./disposablemedicine.js');
    const Employee = require('./employee.js');
    const Medicine = require('./medicine.js');
    const PurchaseLog = require('./purchaselog.js');
    const PurchaseRequest = require('./purchaserequest.js');
    const Sales = require('./sales.js');
    const StockRequest = require('./stockrequest.js');
    const TransferLog = require('./transferlog.js');
    const TransferRequest = require('./transferrequest.js');
    const UserAccount = require('./useraccount.js');
    const UserLog = require('./userlog.js');
    const UserRole = require('./userrole.js');

   //----------------------------------------------------------------------------------------

Medicine.hasMany(Sales, {
    foreignKey: 'drugcode',
    sourceKey: 'drugcode',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Sales.belongsTo(Medicine, {
    foreignKey: 'drugcode',
    targetKey: 'drugcode',
  });
  //--------------------------------------------------------------------------------------
  
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
  
  //--------------------------------------------------------------------------------------
  
  Medicine.hasMany(PurchaseRequest, {
    foreignKey: 'drugcode',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  PurchaseRequest.belongsTo(Medicine, {
    foreignKey: 'drugcode',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  //------------------------------------------------------------------------------------------
  
  DisposableMedicine.belongsTo(Medicine, {
    foreignKey: 'drugcode', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  
  Medicine.hasMany(DisposableMedicine, {
    foreignKey: 'drugcode',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  //---------------------------------------------------------------------------------------
  
  Employee.belongsTo(UserAccount, {
    foreignKey: 'username',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  UserAccount.hasMany(Employee, {
    foreignKey: 'username',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  //-----------------------------------------------------------------------------------------
  
  StockRequest.belongsTo(Medicine, {
    foreignKey: 'drugcode',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Medicine.hasMany(StockRequest, {
    foreignKey: 'drugcode',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  //---------------------------------------------------------------------------------------
  TransferRequest.belongsTo(Medicine, {
    foreignKey: 'drugcode',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Medicine.hasMany(TransferRequest, {
    foreignKey: 'drugcode',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  //---------------------------------------------------------------------------------------
  
  UserRole.belongsTo(UserAccount, {
    foreignKey: 'username',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  UserAccount.hasMany(UserRole, {
    foreignKey: 'username',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  //---------------------------------------------------------------------------------------
  
  UserLog.belongsTo(UserAccount, {
    foreignKey: 'username',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  UserAccount.hasMany(UserLog, {
    foreignKey: 'username',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  //----------------------------------------------------------------------------------------
  StockRequest.hasOne(Dispensary, {
    foreignKey: 'stockrequestno', 
    sourceKey: 'stockrid',       
  });
  
  Dispensary.belongsTo(StockRequest, {
    foreignKey: 'stockrequestno', 
    targetKey: 'stockrid',       
  });
  
  //----------------------------------------------------------------------------------------
  PurchaseRequest.hasOne(PurchaseLog, {
    foreignKey: 'purchaserequestno', 
    sourceKey: 'purchaserid',       
  });
  
  PurchaseLog.belongsTo(PurchaseRequest, {
    foreignKey: 'purchaserequestno', 
    targetKey: 'purchaserid',       
  });
  //----------------------------------------------------------------------------------------
  TransferRequest.hasOne(TransferLog, {
    foreignKey: 'transferrequestno', 
    sourceKey: 'transferrid',       
  });
  
  TransferLog.belongsTo(TransferRequest, {
    foreignKey: 'transferrequestno', 
    targetKey: 'transferrid',       
  });
  
    // Return all models for usage
    return {
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
    };
};

