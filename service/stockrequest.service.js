const StockRequest = require('../models/stockrequest.js');
const Medicine = require('../models/medicine.js');
const Sequelize = require('sequelize');

exports.getStockreqid = async (req, res) => {
    try {
        let nextStockRId;
        const stockExists = await StockRequest.findOne({
            where: { stockrid: 1 },
        });
        if (stockExists) {
            const maxIdResult = await StockRequest.findOne({
                attributes: [[Sequelize.fn('MAX', Sequelize.col('stockrid')), 'maxValue']],
            });
            nextStockRId = (Number(maxIdResult.dataValues.maxValue) || 0) + 1;
        } else {
            nextStockRId = 1;
        }

        console.log('Next PurchaseRId:', nextStockRId);
        res.json({ nextStockRId });
    } catch (error) {
        console.error('Error fetching next PurchaseRId:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listAllstockinrequest = async (req, res) => {
    try {
        const stockInRequests = await StockRequest.findAll({
            attributes: [
                'stockrid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.col('Medicine.classification'), 'Classification'],
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'quantityrequested',
                [Sequelize.literal('"StockRequest"."quantityrequested" - "StockRequest"."quantityremaining"'), 'Supplied'],
                'issuetype',
                'requesteddate',
                'requestedby',
                'authorizedby',
                [
                    Sequelize.literal(`
                        CASE 
                            WHEN "StockRequest"."quantityremaining" = 0 THEN 'completed'
                            WHEN "StockRequest"."quantityrequested" = "StockRequest"."quantityremaining" THEN 'pending'
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
                issuetype: 'issue in',
                quantityrequested: {
                    [Sequelize.Op.eq]: Sequelize.col('quantityremaining')
                }
            },
            order: [
                ['stockrid', 'ASC'],
                ['drugcode', 'ASC']
            ],
            raw: true
        });

        res.json(stockInRequests);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listAllstockoutrequest = async (req, res) => {
    try {
        const stockOutRequests = await StockRequest.findAll({
            attributes: [
                'stockrid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.col('Medicine.classification'), 'Classification'],
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'quantityrequested',
                [Sequelize.literal('"StockRequest"."quantityrequested" - "StockRequest"."quantityremaining"'), 'Supplied'],
                'issuetype',
                'requesteddate',
                'requestedby',
                'authorizedby',
                [
                    Sequelize.literal(`
                        CASE 
                            WHEN "StockRequest"."quantityremaining" = 0 THEN 'completed'
                            WHEN "StockRequest"."quantityrequested" = "StockRequest"."quantityremaining" THEN 'pending'
                            ELSE 'incomplete'
                        END
                    `),
                    'ReqStatus'
                ],
                [Sequelize.col('Medicine.unitsellingprice'), 'UnitSellingPrice']
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
                issuetype: 'issue out',
                quantityrequested: {
                    [Sequelize.Op.eq]: Sequelize.col('quantityremaining')
                }
            },
            order: [
                ['stockrid', 'ASC'],
                ['drugcode', 'ASC']
            ],
            raw: true
        });

        res.json(stockOutRequests);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listAllstockrequest = async (req, res) => {
    try {
        const stockRequests = await StockRequest.findAll({
            attributes: [
                'stockrid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.col('Medicine.classification'), 'Classification'],
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'quantityrequested',
                [Sequelize.literal('"StockRequest"."quantityrequested" - "StockRequest"."quantityremaining"'), 'Supplied'],
                'issuetype',
                'requesteddate',
                'requestedby',
                'authorizedby',
                [
                    Sequelize.literal(`
                        CASE 
                            WHEN "StockRequest"."quantityremaining" = 0 THEN 'completed'
                            WHEN "StockRequest"."quantityrequested" = "StockRequest"."quantityremaining" THEN 'pending'
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
                ['stockrid', 'ASC'],
                ['drugcode', 'ASC']
            ],
            raw: true
        });

        res.json(stockRequests);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listAllunapprovedstockrequest = async (req, res) => {
    try {
        const stockRequests = await StockRequest.findAll({
            attributes: [
                'stockrid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.col('Medicine.classification'), 'Classification'],
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'quantityrequested',
                [Sequelize.literal('"StockRequest"."quantityrequested" - "StockRequest"."quantityremaining"'), 'Supplied'],
                'issuetype',
                'requesteddate',
                'requestedby',
                'authorizedby',
                [
                    Sequelize.literal(`
                        CASE 
                            WHEN "StockRequest"."quantityremaining" = 0 THEN 'completed'
                            WHEN "StockRequest"."quantityrequested" = "StockRequest"."quantityremaining" THEN 'pending'
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
                issuetype: 'issue in',
                quantityrequested: {
                    [Sequelize.Op.eq]: Sequelize.col('quantityremaining')
                }
            },
            order: [
                ['stockrid', 'ASC'],
                ['drugcode', 'ASC']
            ],
            raw: true
        });

        res.json(stockRequests);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};


exports.selectStockrequest = async (req, res) => {
    const { stockrid } = req.body;

    try {
        const stockRequest = await StockRequest.findAll({
            attributes: [
                'stockrid',
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
                        '"StockRequest"."quantityrequested" - "StockRequest"."quantityremaining"'
                    ),
                    'Supplied',
                ],
                'issuetype',
                'requesteddate',
                'requestedby',
                'authorizedby',
                [
                    Sequelize.literal(`
                        CASE 
                            WHEN "StockRequest"."quantityremaining" = 0 THEN 'completed'
                            WHEN "StockRequest"."quantityrequested" = "StockRequest"."quantityremaining" THEN 'pending'
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
                stockrid,
            },
            order: [
                ['stockrid', 'ASC'],
                ['drugcode', 'ASC'],
            ],
            raw: true,
        });

        res.json(stockRequest);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};