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

module.exports = router;


