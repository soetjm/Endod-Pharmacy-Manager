const Dispensary = require("../models/dispensary.js");
const Sequelize = require('sequelize');


exports.countDispensedindrugs = async (req, res) => {
    const { month, year } = req.body;
    
    try {
        const dispensedData = await Dispensary.findAll({
            attributes: [
                'drugcode',
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalquantity'],
                [
                    Sequelize.literal('SUM("quantity" * "unitsellingprice")'),
                    'totalprice',
                ],
                [Sequelize.fn('MIN', Sequelize.col('unitsellingprice')), 'minprice'],
                [Sequelize.fn('MAX', Sequelize.col('unitsellingprice')), 'maxprice'],
            ],
            where:Sequelize.and (
                {issuestatus: 'in store'},
                Sequelize.where(
                    Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "issueddate"')),
                    month
                ),
                Sequelize.where(
                    Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "issueddate"')),
                    year
                )
            ),
            group: ['drugcode'],
        });

        const dispensedArray = [];
        dispensedData.forEach((e) => {
            dispensedArray.push(e.dataValues);
        });

        if (dispensedData.length > 0) {
            console.log('Fetched dispensed drugs data successfully:', dispensedArray);
            res.json(dispensedData);
        } else {
            console.log('No dispensed drugs data found for the specified criteria.');
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching dispensed drugs data:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.countDispensedoutdrugs = async (req, res) => {
    const { month, year } = req.body;

    try {
        const dispensedOutData = await Dispensary.findAll({
            attributes: [
                'drugcode',
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalquantity'],
                [
                    Sequelize.literal('SUM("quantity" * "unitsellingprice")'),
                    'totalprice',
                ],
                [Sequelize.fn('MIN', Sequelize.col('unitsellingprice')), 'minprice'],
                [Sequelize.fn('MAX', Sequelize.col('unitsellingprice')), 'maxprice'],
            ],
            where: Sequelize.literal(`
                "issuestatus" = 'returned'
                AND EXTRACT(MONTH FROM "issueddate") = ${month}
                AND EXTRACT(YEAR FROM "issueddate") = ${year}
            `),
            group: ['drugcode'],
        });

        const dispensedOutArray = [];
        dispensedOutData.forEach((e) => {
            dispensedOutArray.push(e.dataValues);
        });

        if (dispensedOutData.length > 0) {
            console.log('Fetched returned drugs data successfully:', dispensedOutArray);
            res.json(dispensedOutArray);
        } else {
            console.log('No returned drugs data found for the specified criteria.');
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching returned drugs data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listDispensedindrugs = async (req, res) => {
    try {
        const dispensaryData = await Dispensary.findAll({
            attributes: [
                'drugcode',
                'batchno',
                'quantity',
                'unit',
                'unitsellingprice',
                [Sequelize.literal('quantity * unitsellingprice'), 'totalcost'],
                'expirydate',
                'issueddate',
                'stockrequestno',
                'batchstatus',
                'receivedby',
                'deliveredby',
                'remark'
            ],
            where: {
                issuestatus: 'in store'
            },
            order: [
                ['batchstatus', 'ASC'],
                ['drugcode', 'ASC']
            ]
        });

        const dispensaryArray = dispensaryData.map((d) => d.dataValues);
        for (let record of dispensaryArray) {
            if (record.ReceivedBy) {
                const receivedByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('firstname || \' \' || lastname'), 'receivedby']],
                    where: { useruame: record.receivedby }
                });
                record.receivedby = receivedByEmployee ? receivedByEmployee.dataValues.receivedby : null;
            }
            if (record.DeliveredBy) {
                const deliveredByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('firstname || \' \' || lastname'), 'deliveredby']],
                    where: { username: record.deliveredby }
                });
                record.deliveredby = deliveredByEmployee ? deliveredByEmployee.dataValues.deliveredby : null;
            }
        }

        if (dispensaryArray.length > 0) {
            console.log('Fetched dispensed drugs data successfully:', dispensaryArray);
            res.json(dispensaryArray);
        } else {
            console.log('No dispensed drugs data found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching dispensary data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listDispensedoutdrugs = async (req, res) => {
    try {
        const dispensaryData = await Dispensary.findAll({
            attributes: [
                'drugcode',
                'batchno',
                'quantity',
                'unit',
                'unitsellingprice',
                [Sequelize.literal('quantity * unitsellingprice'), 'totalcost'],
                'expirydate',
                'issueddate',
                'stockrequestno',
                'batchstatus',
                'receivedby',
                'deliveredby',
                'remark'
            ],
            where: {
                issuestatus: 'returned'
            },
            order: [
                ['batchstatus', 'ASC'],
                ['drugcode', 'ASC']
            ]
        });

        const dispensaryArray = dispensaryData.map((d) => d.dataValues);

        for (let record of dispensaryArray) {
            if (record.ReceivedBy) {
                const receivedByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('firstname || \' \' || lastname'), 'receivedby']],
                    where: { UserName: record.ReceivedBy }
                });
                record.receivedby = receivedByEmployee ? receivedByEmployee.dataValues.receivedby : null;
            }
            if (record.DeliveredBy) {
                const deliveredByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('firstname || \' \' || lastname'), 'deliveredby']],
                    where: { UserName: record.deliveredby }
                });
                record.deliveredby = deliveredByEmployee ? deliveredByEmployee.dataValues.deliveredby : null;
            }
        }

        if (dispensaryArray.length > 0) {
            console.log('Fetched returned drugs data successfully:', dispensaryArray);
            res.json(dispensaryArray); 
        } else {
            console.log('No returned drugs data found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching returned drugs data:', error);
        res.status(500).send('Internal Server Error');
    }
};


