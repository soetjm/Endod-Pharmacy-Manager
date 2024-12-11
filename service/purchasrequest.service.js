const PurchaseRequest = require('../models/purchaserequest.js');
const Medicine = require('../models/medicine.js');
const Sequelize = require('sequelize');

exports.getPurchasereqid = async (req, res) => {
    try {
        let nextPurchaseRId;
        const purchaseExists = await PurchaseRequest.findOne({
            where: { purchaserid: 1 },
        });
        if (purchaseExists) {
            const maxIdResult = await PurchaseRequest.findOne({
                attributes: [[Sequelize.fn('MAX', Sequelize.col('purchaserid')), 'maxValue']],
            });
            nextPurchaseRId = (Number(maxIdResult.dataValues.maxValue) || 0) + 1;
        } else {
            nextPurchaseRId = 1;
        }

        console.log('Next PurchaseRId:', nextPurchaseRId);
        res.json({ nextPurchaseRId });
    } catch (error) {
        console.error('Error fetching next PurchaseRId:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listAllpurchaserequest = async (req, res) => {
    try {
        const purchaseRequests = await PurchaseRequest.findAll({
            attributes: [
                'purchaserid',
                'drugcode',
                [Sequelize.literal('"PurchaseRequest"."quantityrequested" - "PurchaseRequest"."quantityremaining"'), 'Supplied'],
                'quantityrequested',
                'requesteddate',
                'requestedby',
                'authorizedby',
                'suppliername',
                [
                    Sequelize.literal(`
                        CASE 
                            WHEN "PurchaseRequest"."quantityremaining" = 0 THEN 'completed'
                            WHEN "PurchaseRequest"."quantityrequested" = "PurchaseRequest"."quantityremaining" THEN 'pending'
                            ELSE 'incomplete'
                        END
                    `),
                    'ReqStatus'
                ]
            ],
            include: [
                {
                    model: Medicine,
                    attributes: ['genericname', 'brandname', 'dosage', 'formulation', 'classification', 'unit'],
                    required: true,
                    where: {
                        drugstatus: 'active'
                    }
                }
            ],
            order: [
                ['purchaserid', 'ASC'],
                ['drugcode', 'ASC']
            ]
        });

        const result = purchaseRequests.map(request => ({
            ...request.dataValues,
            ...request.Medicine?.dataValues
        }));

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.listUnsatisfiedpurchaserequest =async (req, res) => {
    try {
        const unsatisfiedPurchaseRequests = await PurchaseRequest.findAll({
            attributes: [
                'purchaserid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.col('Medicine.classification'), 'Classification'],
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'quantityrequested',
                [Sequelize.literal('quantityrequested - quantityremaining'), 'Supplied'],
                'requesteddate',
                'requestedby',
                'authorizedby',
                'suppliername',
                [
                    Sequelize.literal(`CASE 
                        WHEN "quantityremaining" = 0 THEN 'completed' 
                        WHEN "quantityrequested" = "quantityremaining" THEN 'pending' 
                        ELSE 'incomplete' 
                    END`), 
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
            where: Sequelize.where(Sequelize.col('quantityrequested'), Sequelize.col('quantityremaining')),
            order: [
                ['purchaserid', 'ASC'],
                ['drugcode', 'ASC']
            ],
            raw: true
        });

        res.json(unsatisfiedPurchaseRequests);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

exports.selectPurchaseRequest = async (req, res) => {
    const { purchaserid } = req.body;

    try {
        const purchaseRequest = await PurchaseRequest.findAll({
            attributes: [
                ['purchaserid', 'purchaserid'],
                ['drugcode', 'drugcode'],
                [Sequelize.col('Medicine.genericname'), 'genericname'],
                [Sequelize.col('Medicine.brandname'), 'brandname'],
                [Sequelize.col('Medicine.dosage'), 'dosage'],
                [Sequelize.col('Medicine.formulation'), 'formulation'],
                [Sequelize.col('Medicine.classification'), 'classification'],
                [Sequelize.col('Medicine.unit'), 'unit'],
                ['quantityrequested', 'quantityrequested'],
                [Sequelize.literal('"PurchaseRequest"."quantityrequested" - "PurchaseRequest"."quantityremaining"'), 'quantityreceived'],
                ['requesteddate', 'requesteddate'],
                ['requestedby', 'requestedby'],
                ['authorizedby', 'authorizedby'],
                ['suppliername', 'suppliername'],
                [
                    Sequelize.literal(`
                        CASE 
                            WHEN "PurchaseRequest"."quantityremaining" = 0 THEN 'completed'
                            WHEN "PurchaseRequest"."quantityrequested" = "PurchaseRequest"."quantityremaining" THEN 'pending'
                            ELSE 'incomplete'
                        END
                    `),
                    'status'
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
                purchaserid: purchaserid
            },
            order: [
                ['purchaserid', 'ASC'],
                ['drugcode', 'ASC']
            ],
            raw: true
        });

        res.json(purchaseRequest);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};