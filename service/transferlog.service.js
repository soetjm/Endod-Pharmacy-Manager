const TransferLog = require('../models/transferlog.js');
const Sequelize = require('sequelize');

exports.countTransferindrugs = async (req, res) => {
    const { month, year } = req.body;

    try {
        const transferInData = await TransferLog.findAll({
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
                "batchstatus" != 'transferred out'
                AND EXTRACT(MONTH FROM "transferdate") = ${month}
                AND EXTRACT(YEAR FROM "transferdate") = ${year}
            `),
            group: ['drugcode'],
        });

        const transferInArray = [];
        transferInData.forEach((e) => {
            transferInArray.push(e.dataValues);
        });

        if (transferInData.length > 0) {
            console.log('Fetched transfer-in drugs data successfully:', transferInArray);
            res.json(transferInArray);
        } else {
            console.log('No transfer-in drugs data found for the specified criteria.');
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching transfer-in drugs data:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.countTransferoutdrugs = async (req, res) => {
    const { month, year } = req.body;

    try {
        const transferOutData = await TransferLog.findAll({
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
                "batchstatus" = 'transferred out'
                AND EXTRACT(MONTH FROM "transferdate") = ${month}
                AND EXTRACT(YEAR FROM "transferdate") = ${year}
            `),
            group: ['drugcode'],
        });

        const transferOutArray = [];
        transferOutData.forEach((e) => {
            transferOutArray.push(e.dataValues);
        });

        if (transferOutData.length > 0) {
            console.log('Fetched transfer-out drugs data successfully:', transferOutArray);
            res.json(transferOutArray);
        } else {
            console.log('No transfer-out drugs data found for the specified criteria.');
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching transfer-out drugs data:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listTransferdrugsall = async (req, res) => {
    try {
        const transferDrugs = await TransferLog.findAll({
            attributes: [
                'drugcode',
                'batchno',
                'quantity',
                'unitcost',
                [Sequelize.literal('quantity * unitcost'), 'totalcost'], 
                'expirydate',
                'transferdate',
                'transferrequestno',
                'purchaseinvoiceno',
                'batchstatus',
                'transferredfrom',
                'transferredto',
                'receivedby',
                'remark'
            ],
            order: [
                ['batchstatus', 'ASC'],
                ['drugcode', 'ASC']
            ]
        });

        const transferDrugsArray = transferDrugs.map((t) => t.dataValues);

        for (let record of transferDrugsArray) {
            if (record.ReceivedBy) {
                const receivedByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('firstname || \' \' || lastname'), 'ReceivedBy']],
                    where: { UserName: record.ReceivedBy }
                });
                record.ReceivedBy = receivedByEmployee ? receivedByEmployee.dataValues.ReceivedBy : null;
            }
        }

        if (transferDrugsArray.length > 0) {
            console.log('Fetched transfer drug data successfully:', transferDrugsArray);
            res.json(transferDrugsArray); 
        } else {
            console.log('No transfer drug data found.');
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching transfer drug data:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listTransferdrugs = async (req, res) => {
    const { drugcode } = req.body; 

    try {

        const transferDrugs = await TransferLog.findAll({
            attributes: [
                'drugcode',
                'batchno',
                'quantity',
                'unitcost',
                [Sequelize.literal('quantity * unitcost'), 'totalcost'],
                'expirydate',
                'transferdate',
                'transferrequestno',
                'purchaseinvoiceno',
                'batchstatus',
                'transferredfrom',
                'transferredto',
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

        const transferDrugsArray = transferDrugs.map((t) => t.dataValues);
        for (let record of transferDrugsArray) {
            if (record.ReceivedBy) {
                const receivedByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('firstname || \' \' || lastname'), 'ReceivedBy']],
                    where: { UserName: record.ReceivedBy }
                });
                record.ReceivedBy = receivedByEmployee ? receivedByEmployee.dataValues.ReceivedBy : null;
            }
        }

        if (transferDrugsArray.length > 0) {
            console.log('Fetched transfer drug data successfully:', transferDrugsArray);
            res.json(transferDrugsArray); 
        } else {
            console.log('No transfer drug data found for the specified drug code.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching transfer drug data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listTransferindrugsall = async (req, res) => {
    try {
        const transferInDrugs = await TransferLog.findAll({
            attributes: [
                'drugcode',
                'batchno',
                'quantity',
                'unitcost',
                [Sequelize.literal('quantity * unitcost'), 'totalcost'], 
                'expirydate',
                'transferdate',
                'transferrequestno',
                'purchaseinvoiceno',
                'batchstatus',
                'transferredfrom',
                'transferredto',
                'receivedby',
                'remark'
            ],
            where: {
                batchstatus: {
                    [Sequelize.Op.ne]: 'transferred out' 
                }
            },
            order: [
                ['batchstatus', 'ASC'],
                ['drugcode', 'ASC']
            ]
        });

        const transferInDrugsArray = transferInDrugs.map((t) => t.dataValues);
        for (let record of transferInDrugsArray) {
            if (record.ReceivedBy) {
                const receivedByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('firstname || \' \' || lastname'), 'ReceivedBy']],
                    where: { UserName: record.ReceivedBy }
                });
                record.ReceivedBy = receivedByEmployee ? receivedByEmployee.dataValues.ReceivedBy : null;
            }
        }

        if (transferInDrugsArray.length > 0) {
            console.log('Fetched transfer in drug data successfully:', transferInDrugsArray);
            res.json(transferInDrugsArray);
        } else {
            console.log('No transfer in drug data found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching transfer in drug data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listTransferindrugs = async (req, res) => {
    const { drugcode } = req.body; 
    try {
        const transferInDrugs = await TransferLog.findAll({
            attributes: [
                'drugcode',
                'batchno',
                'quantity',
                'unitcost',
                [Sequelize.literal('quantity * unitcost'), 'totalcost'], 
                'expirydate',
                'transferdate',
                'transferrequestno',
                'purchaseinvoiceno',
                'batchstatus',
                'transferredfrom',
                'transferredto',
                'receivedby',
                'remark'
            ],
            where: {
                batchstatus: {
                    [Sequelize.Op.ne]: 'transferred out' 
                },
                drugcode: {
                    [Sequelize.Op.iLike]: `%${drugcode}%` 
                }
            },
            order: [
                ['batchstatus', 'ASC'],
                ['drugcode', 'ASC']
            ]
        });

        const transferInDrugsArray = transferInDrugs.map((t) => t.dataValues);
        for (let record of transferInDrugsArray) {
            if (record.ReceivedBy) {
                const receivedByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('FirstName || \' \' || LastName'), 'ReceivedBy']],
                    where: { UserName: record.ReceivedBy }
                });
                record.ReceivedBy = receivedByEmployee ? receivedByEmployee.dataValues.ReceivedBy : null;
            }
        }

        if (transferInDrugsArray.length > 0) {
            console.log('Fetched filtered transfer in drug data successfully:', transferInDrugsArray);
            res.json(transferInDrugsArray); 
        } else {
            console.log('No transfer in drug data found for the specified drug code.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching filtered transfer in drug data:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listTransferoutdrugsall = async (req, res) => {
    try {
        
        const transferOutDrugs = await TransferLog.findAll({
            attributes: [
                'drugcode',
                'batchno',
                'quantity',
                'unitcost',
                [Sequelize.literal('quantity * unitcost'), 'totalcost'], 
                'expirydate',
                'transferdate',
                'transferrequestno',
                'purchaseinvoiceno',
                'batchstatus',
                'transferredfrom',
                'transferredto',
                'receivedby',
                'remark'
            ],
            where: {
                batchstatus: 'transferred out' 
            },
            order: [
                ['batchstatus', 'ASC'],
                ['drugcode', 'ASC']
            ]
        });

        const transferOutDrugsArray = transferOutDrugs.map((t) => t.dataValues);

        for (let record of transferOutDrugsArray) {
            if (record.ReceivedBy) {
                const receivedByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('firstname || \' \' || lastname'), 'ReceivedBy']],
                    where: { UserName: record.ReceivedBy }
                });
                record.ReceivedBy = receivedByEmployee ? receivedByEmployee.dataValues.ReceivedBy : null;
            }
        }

        if (transferOutDrugsArray.length > 0) {
            console.log('Fetched transfer out drug data successfully:', transferOutDrugsArray);
            res.json(transferOutDrugsArray); 
        } else {
            console.log('No transfer out drug data found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching transfer out drug data:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.listTransferoutdrugs = async (req, res) => {
    try {
        const drugcode = req.body.drugcode;
        const transferOutDrugs = await TransferLog.findAll({
            attributes: [
                'drugcode',
                'batchno',
                'quantity',
                'unitcost',
                [Sequelize.literal('quantity * unitcost'), 'totalcost'], 
                'expirydate',
                'transferdate',
                'transferrequestno',
                'purchaseinvoiceno',
                'batchstatus',
                'transferredfrom',
                'transferredto',
                'receivedby',
                'remark'
            ],
            where: {
                batchstatus: 'transferred out',
                drugcode: {
                    [Sequelize.Op.iLike]: `%${drugcode}%` 
                }
            },
            order: [
                ['batchstatus', 'ASC'],
                ['drugcode', 'ASC']
            ]
        });

        const transferOutDrugsArray = transferOutDrugs.map((t) => t.dataValues);

        for (let record of transferOutDrugsArray) {
            if (record.ReceivedBy) {
                const receivedByEmployee = await Employee.findOne({
                    attributes: [[Sequelize.literal('firstname || \' \' || lastname'), 'ReceivedBy']],
                    where: { UserName: record.ReceivedBy }
                });
                record.ReceivedBy = receivedByEmployee ? receivedByEmployee.dataValues.ReceivedBy : null;
            }
        }

        if (transferOutDrugsArray.length > 0) {
            console.log('Fetched transfer out drug data successfully:', transferOutDrugsArray);
            res.json(transferOutDrugsArray); 
        } else {
            console.log('No transfer out drug data found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching transfer out drug data:', error);
        res.status(500).send('Internal Server Error');
    }
};