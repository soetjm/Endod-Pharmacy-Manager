// const { where } = require('sequelize');
// const Employee = require('../models/employee.js');
const BookLog = require("../models/booklog.js");
// const Dispensary = require("../models/dispensary.js");
const DisposableMedicine =require('../models/disposablemedicine.js');
// const Medicine = require('../models/medicine.js');
// const Pharmaciy = require('../models/pharmacy.js');
// const PurchaseLog = require('../models/purchaselog.js');
// const PurchaseRequest = require('../models/purchaserequest.js');
// const Sales = require('../models/sales.js');
// const StockRequest = require('../models/stockrequest.js');
// const Supplier = require('../models/supplier.js');
// const TransferLog = require('../models/transferlog.js');
// const TransferRequest = require('../models/transferrequest.js');
// const UserAccount = require('../models/useraccount.js');
const UserLog = require('../models/userlog.js');
// const UserRole = require('../models/userrole.js');

const EmployeService = require('../service/employe.service.js');
const MedicineService = require('../service/medicen.service.js');
const UserRoleService = require('../service/userrole.service.js');
const SalesService = require('../service/sales.service.js');
const UserAccountService = require('../service/useraccount.service.js');
const DispensaryService = require('../service/dispensary.service.js');
const PurchaseLogService = require('../service/purchaselog.service.js');
const TransferLogService = require('../service/transferlog.service.js');
const DisposableMedicineService = require('../service/disposalmedicen.service.js');
const PurchaseRequestService = require('../service/purchasrequest.service.js');
const StockRequestService = require('../service/stockrequest.service.js');
const TransferRequestService = require('../service/transferrequest.service.js');
const PharmaciyService = require('../service/pharmaciy.service.js');
const SupplierService = require('../service/supplier.service.js');


exports.ViewEmployeeName = EmployeService.ViewEmployeeName

exports.addMedicen = MedicineService.addMedicen;

exports.addRole = UserRoleService.addRole

exports.allRevenuebyate=SalesService.allRevenuebyate;

exports.allRevenuebymonth = SalesService.allRevenubymonth;

exports.allrevenuebymonthyear = SalesService.allrevenuebymonthyear;


exports.allRevenubyyear = SalesService.allRevenubyyear;


exports.allSoldbymonthcode = SalesService.allSoldbymonthcode;


exports.changePassword =UserAccountService.changePassword;


exports.checkAccountrole = UserAccountService.checkAccountrole;

exports.countDispensedindrugs = DispensaryService.countDispensedindrugs;

exports.countDispensedoutdrugs = DispensaryService.countDispensedoutdrugs;

exports.countPurchaseddrugs = PurchaseLogService.countPurchaseddrugs;

exports.countTransferindrugs = TransferLogService.countTransferindrugs;

exports.countTransferoutdrugs = TransferLogService.countTransferoutdrugs;

exports.countunApproveddisposable = DisposableMedicineService.countunApproveddisposable;

exports.createAccount = UserAccountService.createAccount;

exports.createEmployee = EmployeService.createEmployee;

exports.forgetPassword = UserAccountService.forgetPassword;

exports.getPurchasereqid = PurchaseRequestService.getPurchasereqid;

exports.getSalesid = SalesService.getSalesid;

exports.getStockreqid = StockRequestService.getStockreqid;

exports.getTransferreqid = TransferRequestService.getTransferreqid;

exports.listactivePharmacies = PharmaciyService.listactivePharmacies;

exports.listActivesuppliers = SupplierService.listActivesuppliers;

exports.listActiveusernames = UserAccountService.listActiveusernames;

exports.listAllactivecodes = MedicineService.listAllactivecodes;

exports.listAllactivemedicines = MedicineService.listAllactivemedicines;

exports.listAllrevenueformonthyear = SalesService.listAllrevenueformonthyear;

exports.listAllsharedmedicines = MedicineService.listAllsharedmedicines;

exports.listAllusernames = UserAccountService.listAllusernames;

exports.listDispensedindrugs = DispensaryService.listDispensedindrugs;

exports.listDispensedoutdrugs = DispensaryService.listDispensedoutdrugs;

exports.listPurchaseddrugs = PurchaseLogService.listPurchaseddrugs;

exports.listPurchaseddrugs = PurchaseLogService.listPurchaseddrugs;

exports.listTransferdrugsall = TransferLogService.listTransferdrugsall;

exports.listTransferdrugs = TransferLogService.listTransferdrugs;

exports.listTransferindrugsall = TransferLogService.listTransferindrugsall;

exports.listTransferindrugs = TransferLogService.listTransferindrugs;

exports.listTransferoutdrugsall= TransferLogService.listTransferoutdrugsall;

exports.listTransferoutdrugs = TransferLogService.listTransferoutdrugs;

exports.listUnapproveddisposable = DisposableMedicineService.listUnapproveddisposable;

exports.canLogin = UserRoleService.canLogin;

exports.listActiveemployees =  EmployeService.listActiveemployees;