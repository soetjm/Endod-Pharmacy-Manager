const Sequelize = require('sequelize');
const BookLog = require('../models/booklog.js');
const Medicine = require('../models/medicine.js');
const {Op,fn,col} = require('sequelize')
const Sales = require('../models/sales.js');


exports.selectBooklogbyprescription = async (req, res) => {
    const { prescriptiontype } = req.body;
    if(!prescriptiontype){
        res.json({message:'Empity perscriptiontype'});
    }

    try {
        const bookLogs = await BookLog.findAll({
            attributes: [
                ['salesid', 'salesid'],
                ['drugcode', 'drugcode'],
                [Sequelize.literal('customerfname || \' \' || customerlname'), 'customerfullname'],
                ['gender', 'gender'],
                ['age', 'age'],
                ['cardno', 'cardno'],
                ['prescriptionserialno', 'prescriptionserialno'],
                ['prescribeddate', 'prescribeddate'],
                ['prescriberaddress', 'prescriberaddress'],
            ],
            where: {
                prescriptiontype: prescriptiontype
            },
            order: [
                ['salesid', 'ASC']
            ],
            raw: true
        });

        const booklogIdArray = [];
        const booklogDrugcodeArray = [];
        bookLogs.forEach(element => {
            booklogIdArray.push(element.salesid);
            booklogDrugcodeArray.push(element.drugcode);
        });
        const medicine = await Medicine.findAll({
            attributes:[
                [('drugcode'),'drugcode'],
                [('genericname'), 'genericname'],
                [('brandname'), 'brandname'],
                [('dosage'), 'dosage'],
                [('formulation'), 'formulation'],
                [('unit'), 'unit']
            ],
            where: {
                drugcode: {
                  [Op.in]: booklogDrugcodeArray
                },
                drugstatus: 'active'
            },
            raw:true,
        })

        const sales = await Sales.findAll({
            attributes:[
                ['salesid','salesid'],
                ['drugcode','drugcode'],
                ['dispensedby', 'dispensedby'],
                ['salesdate', 'salesdate'],
                ['quantity', 'quantity'],
            ],
            where: {
                drugcode: {
                  [Op.in]: booklogDrugcodeArray
                },
                salesid:{
                   [Op.in]: booklogIdArray
                },
                salesstatus: 'sold'
            },
            raw:true,
        })
        const joinedArray = bookLogs.map(item1 => {
            const matchedItem2 = medicine.find(item2 => item2.drugcode === item1.drugcode);
            const matchedItem3 = sales.find(item3 => item3.salesid === item1.salesid && item3.drugcode === item1.drugcode);
            let mergedItem = { ...item1 };
            if (matchedItem2) {
              mergedItem = { ...mergedItem, ...matchedItem2 };
            }
            if (matchedItem3) {
              mergedItem = { ...mergedItem, ...matchedItem3 };
            }
            return mergedItem;
        })
        res.json(joinedArray);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.selectBooklogbyprescriptiondate = async (req, res) => {
    const { prescriptiontype,month,year } = req.body;
    if(!prescriptiontype){
        res.json({message:'Empity perscriptiontype'});
    }

    try {
        const bookLogs = await BookLog.findAll({
            attributes: [
                ['salesid', 'salesid'],
                ['drugcode', 'drugcode'],
                [Sequelize.literal('customerfname || \' \' || customerlname'), 'customerfullname'],
                ['gender', 'gender'],
                ['age', 'age'],
                ['cardno', 'cardno'],
                ['prescriptionserialno', 'prescriptionserialno'],
                ['prescribeddate', 'prescribeddate'],
                ['prescriberaddress', 'prescriberaddress'],
            ],
            where: {
                prescriptiontype: prescriptiontype
            },
            order: [
                ['salesid', 'ASC']
            ],
            raw: true
        });

        const booklogIdArray = [];
        const booklogDrugcodeArray = [];
        bookLogs.forEach(element => {
            booklogIdArray.push(element.salesid);
            booklogDrugcodeArray.push(element.drugcode);
        });
        const medicine = await Medicine.findAll({
            attributes:[
                [('drugcode'),'drugcode'],
                [('genericname'), 'genericname'],
                [('brandname'), 'brandname'],
                [('dosage'), 'dosage'],
                [('formulation'), 'formulation'],
                [('unit'), 'unit']
            ],
            where: {
                drugcode: {
                  [Op.in]: booklogDrugcodeArray
                },
                drugstatus: 'active'
            },
            raw:true,
        })

        const sales = await Sales.findAll({
            attributes:[
                ['salesid','salesid'],
                ['drugcode','drugcode'],
                ['dispensedby', 'dispensedby'],
                ['salesdate', 'salesdate'],
                ['quantity', 'quantity'],
            ],
            where: {
                drugcode: {
                  [Op.in]: booklogDrugcodeArray
                },
                salesid:{
                   [Op.in]: booklogIdArray
                },   
                [Op.and]: [
                    Sequelize.where(fn('EXTRACT', fn('YEAR FROM', col('salesdate'))), year),
                    Sequelize.where(fn('EXTRACT', fn('MONTH FROM', col('salesdate'))), month),
                ],
                salesstatus: 'sold'
            },
            raw:true,
        })
        if(sales.length==0){
            res.json({message:'no match in year or month'});
            return
        }
        const joinedArray = bookLogs.map(item1 => {
            const matchedItem2 = medicine.find(item2 => item2.drugcode === item1.drugcode);
            const matchedItem3 = sales.find(item3 => item3.salesid === item1.salesid && item3.drugcode === item1.drugcode);
            let mergedItem = { ...item1 };
            if (matchedItem2) {
              mergedItem = { ...mergedItem, ...matchedItem2 };
            }
            if (matchedItem3) {
              mergedItem = { ...mergedItem, ...matchedItem3 };
            }
            return mergedItem;
        })
        res.json(joinedArray);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
