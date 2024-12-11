const TransferRequest = require('../models/transferrequest.js');
const Medicine = require('../models/medicine.js');
const Sequelize = require('sequelize');

exports.getTransferreqid = async (req, res) => {
    try {
        let nextTransferRId;
        const stockExists = await TransferRequest.findOne({
            where: { transferrid: 1 },
        });
        if (stockExists) {
            const maxIdResult = await TransferRequest.findOne({
                attributes: [[Sequelize.fn('MAX', Sequelize.col('transferrid')), 'maxValue']],
            });
            nextTransferRId = (Number(maxIdResult.dataValues.maxValue) || 0) + 1;
        } else {
            nextTransferRId = 1;
        }

        console.log('Next PurchaseRId:', nextTransferRId);
        res.json({ nextTransferRId });
    } catch (error) {
        console.error('Error fetching next PurchaseRId:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listAlltransferrequest = async (req, res) => {
    try {
        const transferRequests = await TransferRequest.findAll({
            attributes: [
                'transferrid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.col('Medicine.classification'), 'Classification'],
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'quantityrequested',
                [Sequelize.literal('"TransferRequest"."quantityrequested" - "TransferRequest"."quantityremaining"'), 'Supplied'],
                'requesteddate',
                'transfertype',
                'transferredfrom',
                'transferredto',
                'purchasedate',
                'requestedby',
                'authorizedby',
                [
                    Sequelize.literal(`
                        CASE 
                            WHEN "TransferRequest"."quantityremaining" = 0 THEN 'completed'
                            WHEN "TransferRequest"."quantityrequested" = "TransferRequest"."quantityremaining" THEN 'pending'
                            ELSE 'incomplete'
                        END
                    `),
                    'ReqStatus'
                ]
            ],
            include: [
                {
                    model: Medicine,
                    attributes: [],
                    where: {
                        drugstatus: 'active'
                    }
                }
            ],
            order: [
                ['transferrid', 'ASC'],
                ['drugcode', 'ASC']
            ],
            raw: true
        });

        res.json(transferRequests);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listAllunsatisfiedtransferinrequest = async (req, res) => {
    try {
        const transferRequests = await TransferRequest.findAll({
            attributes: [
                'transferrid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.col('Medicine.classification'), 'Classification'],
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'quantityrequested',
                [Sequelize.literal('"TransferRequest"."quantityrequested" - "TransferRequest"."quantityremaining"'), 'Supplied'],
                'requesteddate',
                'transfertype',
                'transferredfrom',
                'transferredto',
                'purchasedate',
                'requestedby',
                'authorizedby',
                [
                    Sequelize.literal(`
                        CASE 
                            WHEN "TransferRequest"."quantityremaining" = 0 THEN 'completed'
                            WHEN "TransferRequest"."quantityrequested" = "TransferRequest"."quantityremaining" THEN 'pending'
                            ELSE 'incomplete'
                        END
                    `),
                    'ReqStatus'
                ]
            ],
            include: [
                {
                    model: Medicine,
                    attributes: [],
                    where: {
                        drugstatus: 'active'
                    }
                }
            ],
            where: {
                transfertype: 'transferred in',
                quantityrequested: {
                    [Sequelize.Op.eq]: Sequelize.col('quantityremaining')
                }
            },
            order: [
                ['transferrid', 'ASC'],
                ['drugcode', 'ASC']
            ],
            raw: true
        });

        res.json(transferRequests);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

exports.listAllunsatisfiedtransferoutrequest = async (req, res) => {
    try {
        const transferRequests = await TransferRequest.findAll({
            attributes: [
                'transferrid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.col('Medicine.classification'), 'Classification'],
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'quantityrequested',
                [Sequelize.literal('"TransferRequest"."quantityrequested" - "TransferRequest"."quantityremaining"'), 'Supplied'],
                'requesteddate',
                'transfertype',
                'transferredfrom',
                'transferredto',
                'purchasedate',
                'requestedby',
                'authorizedby',
                [
                    Sequelize.literal(`
                        CASE 
                            WHEN "TransferRequest"."quantityremaining" = 0 THEN 'completed'
                            WHEN "TransferRequest"."quantityrequested" = "TransferRequest"."quantityremaining" THEN 'pending'
                            ELSE 'incomplete'
                        END
                    `),
                    'ReqStatus'
                ]
            ],
            include: [
                {
                    model: Medicine,
                    attributes: [],
                    where: {
                        drugstatus: 'active'
                    }
                }
            ],
            where: {
                transfertype: 'transferred out',
                quantityrequested: {
                    [Sequelize.Op.eq]: Sequelize.col('quantityremaining')
                }
            },
            order: [
                ['transferrid', 'ASC'],
                ['drugcode', 'ASC']
            ],
            raw: true
        });

        res.json(transferRequests);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


exports.selectTransferrequest = async (req, res) => {
    const { transferrid } = req.body;

    try {
        const transferRequest = await TransferRequest.findAll({
            attributes: [
                'transferrid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.col('Medicine.classification'), 'Classification'],
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'quantityrequested',
                [
                    Sequelize.literal(
                        '"TransferRequest"."quantityrequested" - "TransferRequest"."quantityremaining"'
                    ),
                    'Supplied',
                ],
                'requesteddate',
                'transfertype',
                'transferredfrom',
                'transferredto',
                'purchasedate',
                'requestedby',
                'authorizedby',
                [
                    Sequelize.literal(`
                        CASE 
                            WHEN "TransferRequest"."quantityremaining" = 0 THEN 'completed'
                            WHEN "TransferRequest"."quantityrequested" = "TransferRequest"."quantityremaining" THEN 'pending'
                            ELSE 'incomplete'
                        END
                    `),
                    'ReqStatus',
                ],
            ],
            include: [
                {
                    model: Medicine,
                    attributes: [],
                    where: {
                        drugstatus: 'active',
                    },
                },
            ],
            where: {
                transferrid,
            },
            order: [
                ['transferrid', 'ASC'],
                ['drugcode', 'ASC'],
            ],
            raw: true,
        });

        res.json(transferRequest);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
