const express = require('express');

const Dbfunction = require('../controllers/DbFunction.js');

const router = express.Router();

router.get('/viewemploye/:username',Dbfunction.ViewEmployeeName);

router.post('/addMedicen',Dbfunction.addMedicen);

router.post('/addRole',Dbfunction.addRole);

router.get('/allRevenuebyate',Dbfunction.allRevenuebyate);


router.get('/allRevenuebymonth',Dbfunction.allRevenuebymonth);


router.get('/allRevenuebymonthyear',Dbfunction.allrevenuebymonthyear);


router.get('/allRevenubyyear',Dbfunction.allRevenubyyear);

router.get('/allSoldbymonthcode',Dbfunction.allSoldbymonthcode);

router.put('/changepassword',Dbfunction.changePassword);

router.get('/checkAccountrole',Dbfunction.checkAccountrole);

router.get('/countDispensedindrugs',Dbfunction.countDispensedindrugs);

router.get('/countDispensedoutdrugs',Dbfunction.countDispensedoutdrugs);

router.get('/countPurchaseddrugs',Dbfunction.countPurchaseddrugs);

router.get('/countTransferindrugs',Dbfunction.countTransferindrugs);

router.get('/countTransferoutdrugs',Dbfunction.countTransferoutdrugs);

router.get('/countunApproveddisposable',Dbfunction.countunApproveddisposable);

router.post('/createAccount',Dbfunction.createAccount);

router.post('/createEmployee',Dbfunction.createEmployee);

router.put('/forgetPassword',Dbfunction.forgetPassword);

router.get('/getPurchasereqid',Dbfunction.getPurchasereqid);

router.get('/getSalesid',Dbfunction.getSalesid);

router.get('/getStockreqid',Dbfunction.getStockreqid);

router.get('/getTransferreqid',Dbfunction.getTransferreqid);

router.get('/listactivePharmacies',Dbfunction.listactivePharmacies);

router.get('/listActivesuppliers',Dbfunction.listActivesuppliers);

router.get('/listActiveusernames',Dbfunction.listActiveusernames);

router.get('/listAllactivecodes',Dbfunction.listAllactivecodes);

router.get('/listAllactivemedicines',Dbfunction.listAllactivemedicines);

router.get('/listAllrevenueformonthyear',Dbfunction.listAllrevenueformonthyear)

router.get('/listAllsharedmedicines',Dbfunction.listAllsharedmedicines);

router.get('/listAllusernames',Dbfunction.listAllusernames);

router.get('/listDispensedindrugs',Dbfunction.listDispensedindrugs);

router.get('/listDispensedoutdrugs',Dbfunction.listDispensedoutdrugs);

router.get('/listPurchaseddrugs',Dbfunction.listPurchaseddrugs);

router.get('/listPurchaseddrugs',Dbfunction.listPurchaseddrugs);

router.get('/listTransferdrugsall',Dbfunction.listTransferdrugsall);

router.get('/listTransferdrugs',Dbfunction.listTransferdrugs);

router.get('/listTransferindrugsall',Dbfunction.listTransferindrugsall);

router.get('/listTransferindrugs',Dbfunction.listTransferindrugs);

router.get('/listTransferoutdrugsall',Dbfunction.listTransferoutdrugsall);

router.get('/listTransferoutdrugs',Dbfunction.listTransferoutdrugs);

router.get('/listUnapproveddisposable',Dbfunction.listUnapproveddisposable);

router.get('/canLogin',Dbfunction.canLogin);

router.get('/listActiveemployees',Dbfunction.listActiveemployees);

router.get('/listActiveemployeeswithroles',Dbfunction.listActiveemployeeswithroles);

router.get('/listAllemployees',Dbfunction.listAllemployees);

router.get('/listAllpurchaserequest',Dbfunction.listAllpurchaserequest);

router.get('/listAllsalemonths',Dbfunction.listAllsalemonths);

router.get('/listAllsales',Dbfunction.listAllsales);

router.get('/listAllsalesforyearmonth',Dbfunction.listAllsalesforyearmonth);

router.get('/listAllsaleyears',Dbfunction.listAllsaleyears);

router.get('/listAllstockinrequest',Dbfunction.listAllstockinrequest);

router.get('/listAllstockoutrequest',Dbfunction.listAllstockoutrequest);

router.get('/listAllstockrequest',Dbfunction.listAllstockrequest);

router.get('/listAlltransferrequest',Dbfunction.listAlltransferrequest);

router.get('/listAllunapprovedstockrequest',Dbfunction.listAllunapprovedstockrequest);

router.get('/listAllunsatisfiedtransferinrequest',Dbfunction.listAllunsatisfiedtransferinrequest);

router.get('/listAllunsatisfiedtransferoutrequest',Dbfunction.listAllunsatisfiedtransferoutrequest);

router.get('/listApproveddisposable',Dbfunction.listApproveddisposable);

router.get('/listReturnedsales',Dbfunction.listReturnedsales);

router.get('/listUnapproveddisposable',Dbfunction.listUnapproveddisposable);

router.get('/listUnsatisfiedpurchaserequest',Dbfunction.listUnsatisfiedpurchaserequest);

router.get('/listUserLogs',Dbfunction.listUserLogs);

router.get('/listUserroles',Dbfunction.listUserroles);

router.get('/salesNotrecorded',Dbfunction.salesNotrecorded);

router.get('/searchBybrand',Dbfunction.searchBybrand);

router.get('/searchBydrugcode',Dbfunction.searchBydrugcode);

router.get('/searchBygeneric',Dbfunction.searchBygeneric);

router.get('/selectActivepharmacy',Dbfunction.selectActivepharmacy);

router.get('/selectActivesupplier',Dbfunction.selectActivesupplier);

router.get('/selectBooklogbyprescription',Dbfunction.selectBooklogbyprescription);

router.get('/selectBooklogbyprescriptiondate',Dbfunction.selectBooklogbyprescriptiondate);

router.get('/selectCurrentpharmacy',Dbfunction.selectCurrentpharmacy);

router.get('/selectEmployeeInfo',Dbfunction.selectEmployeeInfo);

router.get('/selectMedicineDetails',Dbfunction.selectMedicineDetails);

router.get('/selectPurchaseRequest',Dbfunction.selectPurchaseRequest);

router.get('/selectRevenueByWeek',Dbfunction.selectRevenueByWeek);

router.get('/selectMonthlySales',Dbfunction.selectMonthlySales);

router.get('/selectSoldbyweekcode',Dbfunction.selectSoldbyweekcode);

router.get('/selectStockrequest',Dbfunction.selectStockrequest);

router.get('/selectTransferrequest',Dbfunction.selectTransferrequest);

router.get('/selectUserrole',Dbfunction.selectUserrole);

router.get('/viewStorestockcardbatch',Dbfunction.viewStorestockcardbatch);

module.exports = router;


