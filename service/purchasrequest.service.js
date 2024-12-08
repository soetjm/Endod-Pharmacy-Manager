const PurchaseRequest = require('../models/purchaserequest.js');
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