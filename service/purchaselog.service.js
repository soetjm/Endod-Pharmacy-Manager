const PurchaseLog = require('../models/purchaselog.js');
const Sequelize = require('sequelize');


exports.countPurchaseddrugs = async (req, res) => {
    const { month, year } = req.body;

    try {
        const purchasedData = await PurchaseLog.findAll({
            attributes: [
                'drugcode',
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalquantity'],
                [
                    Sequelize.literal('SUM("quantity" * "unitcost")'),
                    'totalprice',
                ],
                [Sequelize.fn('MIN', Sequelize.col('unitcost')), 'minprice'],
                [Sequelize.fn('MAX', Sequelize.col('unitcost')), 'maxprice'],
            ],
            where: Sequelize.literal(`
                EXTRACT(MONTH FROM "purchasedate") = ${month}
                AND EXTRACT(YEAR FROM "purchasedate") = ${year}
            `),
            group: ['drugcode'],
        });

        const purchasedArray = [];
        purchasedData.forEach((e) => {
            purchasedArray.push(e.dataValues);
        });

        if (purchasedData.length > 0) {
            console.log('Fetched purchased drugs data successfully:', purchasedArray);
            res.json(purchasedArray);
        } else {
            console.log('No purchased drugs data found for the specified criteria.');
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching purchased drugs data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listPurchaseddrugs  = async (req, res) => {
    try {
        const purchasedDrugs = await PurchaseLog.findAll({
            attributes: [
                'drugcode',
                'batchno',
                'quantity',
                'unitcost',
                [Sequelize.literal('quantity * unitcost'), 'totalcost'],
                'expirydate',
                'purchasedate',
                'purchaserequestno',
                'purchaseinvoiceno',
                'batchstatus',
                'receivedby',
                'remark'
            ],
            order: [
                ['batchstatus', 'ASC'],
                ['drugcode', 'ASC']
            ]
        });

        const purchasedDrugsArray = purchasedDrugs.map((p) => p.dataValues);

        for (let record of purchasedDrugsArray) {
            if (record.ReceivedBy) {
                const receivedByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('firstname || \' \' || lastname'), 'receivedby']],
                    where: { UserName: record.receivedby }
                });
                record.receivedby = receivedByEmployee ? receivedByEmployee.dataValues.receivedby : null;
            }
        }

        if (purchasedDrugsArray.length > 0) {
            console.log('Fetched purchased drugs data successfully:', purchasedDrugsArray);
            res.json(purchasedDrugsArray); 
        } else {
            console.log('No purchased drugs data found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching purchased drugs data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listPurchaseddrugs = async (req, res) => {
    const { drugcode } = req.body; 

    try {
        const purchasedDrugs = await PurchaseLog.findAll({
            attributes: [
                'drugcode',
                'batchno',
                'quantity',
                'unitcost',
                [Sequelize.literal('quantity * unitcost'), 'totalcost'],
                'expirydate',
                'purchasedate',
                'purchaserequestno',
                'purchaseinvoiceno',
                'batchstatus',
                'receivedby',
                'remark'
            ],
            where: {
                drugcode: {
                    [Sequelize.Op.iLike]: `%${drugcode}%` 
                }
            },
            order: [
                ['batchstatus', 'ASC'],
                ['drugcode', 'ASC']
            ]
        });

        const purchasedDrugsArray = purchasedDrugs.map((p) => p.dataValues);

        for (let record of purchasedDrugsArray) {
            if (record.ReceivedBy) {
                const receivedByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('firstname || \' \' || lastname'), 'receivedby']],
                    where: { username: record.ReceivedBy }
                });
                record.receivedby = receivedByEmployee ? receivedByEmployee.dataValues.receivedby : null;
            }
        }

        if (purchasedDrugsArray.length > 0) {
            console.log('Fetched purchased drugs data successfully:', purchasedDrugsArray);
            res.json(purchasedDrugsArray); 
        } else {
            console.log('No purchased drugs data found for the given DrugCode.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching purchased drugs data:', error);
        res.status(500).send('Internal Server Error');
    }
};