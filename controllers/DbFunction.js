const DisposableMedicine =require('../models/disposablemedicine.js');
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
const UserLogService = require('../service/userlog.service.js');
const BookLogService = require('../service/booklog.service.js');


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

exports.listActiveemployeeswithroles = EmployeService.listActiveemployeeswithroles;

exports.listAllemployees = EmployeService.listAllemployees;

exports.listAllpurchaserequest = PurchaseRequestService.listAllpurchaserequest;

exports.listAllsalemonths = SalesService.listAllsalemonths;

exports.listAllsales = SalesService.listAllsales;

exports.listAllsalesforyearmonth = SalesService.listAllsalesforyearmonth;

exports.listAllsaleyears = SalesService.listAllsaleyears;

exports.listAllstockinrequest = StockRequestService.listAllstockinrequest;

exports.listAllstockoutrequest = StockRequestService.listAllstockoutrequest;

exports.listAllstockrequest =StockRequestService.listAllstockrequest;

exports.listAlltransferrequest = TransferRequestService.listAlltransferrequest;

exports.listAllunapprovedstockrequest = StockRequestService.listAllunapprovedstockrequest;

exports.listAllunsatisfiedtransferinrequest =TransferRequestService.listAllunsatisfiedtransferinrequest;

exports.listAllunsatisfiedtransferoutrequest = TransferRequestService.listAllunsatisfiedtransferoutrequest;

exports.listApproveddisposable = DisposableMedicineService.listApproveddisposable;

exports.listReturnedsales = SalesService.listReturnedsales;

exports.listUnapproveddisposable = DisposableMedicineService.listUnapproveddisposable;

exports.listUnsatisfiedpurchaserequest = PurchaseRequestService.listUnsatisfiedpurchaserequest;

exports.listUserLogs = UserLogService.listUserLogs;

exports.listUserroles = UserRoleService.listUserroles;

exports.salesNotrecorded = SalesService.salesNotrecorded;

exports.searchBybrand = MedicineService.searchBybrand;

exports.searchBydrugcode = MedicineService.searchBydrugcode;

exports.searchBygeneric = MedicineService.searchBygeneric;

exports.selectActivepharmacy = PharmaciyService.selectActivepharmacy;

exports.selectActivesupplier = SupplierService.selectActivesupplier;

exports.selectBooklogbyprescription = BookLogService.selectBooklogbyprescription;

exports.selectBooklogbyprescriptiondate = BookLogService.selectBooklogbyprescriptiondate;

exports.selectCurrentpharmacy = PharmaciyService.selectCurrentpharmacy;

exports.selectEmployeeInfo = EmployeService.selectEmployeeInfo;

exports.selectMedicineDetails = MedicineService.selectMedicineDetails;

exports.selectPurchaseRequest = PurchaseRequestService.selectPurchaseRequest;

exports.selectRevenueByWeek = SalesService.selectRevenueByWeek;

exports.selectMonthlySales = SalesService.selectMonthlySales;

exports.selectSoldbyweekcode = SalesService.selectSoldbyweekcode;

exports.selectStockrequest = StockRequestService.selectStockrequest;

exports.selectTransferrequest = TransferRequestService.selectTransferrequest;

exports.selectUserrole = UserRoleService.selectUserrole;

exports.viewStorestockcardbatch = MedicineService.viewStorestockcardbatch;

exports.listSharedAvailableDrugs = MedicineService.listSharedAvailableDrugs;

exports.listMinMaxMedicineCost = MedicineService.listMinMaxMedicineCost;

exports.getMinMaxMedicineCostByDrugCode = MedicineService.getMinMaxMedicineCostByDrugCode;

exports.searchDispensaryStockByBrand = MedicineService.searchDispensaryStockByBrand;

exports.searchDispensaryStockByCode = MedicineService.searchDispensaryStockByCode;

exports.searchDispensaryStockByGeneric = MedicineService.searchDispensaryStockByGeneric;

exports.searchStoreStockByBrand = MedicineService.searchStoreStockByBrand;

exports.searchStoreStockByCode = MedicineService.searchStoreStockByCode;

exports.searchStoreStockByGeneric = MedicineService.searchStoreStockByGeneric;

exports.searchTransferableStockByBrand = MedicineService.searchTransferableStockByBrand;

exports.searchTransferableStockByCode = MedicineService.searchTransferableStockByCode;

exports.searchTransferableStockByGeneric = MedicineService.searchTransferableStockByGeneric;

exports.selectAvailableDrug = MedicineService.selectAvailableDrug;

exports.viewAllAvailableDrugs = MedicineService.viewAllAvailableDrugs;

exports.viewAllPharmacyDrugs = MedicineService.viewAllPharmacyDrugs;

exports.viewAllTockOutDrugs = MedicineService.viewAllTockOutDrugs;

exports.viewDispensaryActiveBatches = MedicineService.viewDispensaryActiveBatches;

exports.viewDispensaryActiveBatchesWithExpiry = MedicineService.viewDispensaryActiveBatchesWithExpiry;

exports.viewDispensaryStock = MedicineService.viewDispensaryStock;

exports.viewDispensaryStockCard = MedicineService.viewDispensaryStockCard;

exports.viewInStore = MedicineService.viewInStore;

exports.viewStoreStock = MedicineService.viewStoreStock;

exports.viewStoreStockCard = MedicineService.viewStoreStockCard;

exports.viewStoreStockCardBatch = MedicineService.viewStoreStockCardBatch;

exports.viewStoreStockCardBatchByCode = MedicineService.viewStoreStockCardBatchByCode;