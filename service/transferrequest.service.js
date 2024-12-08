const TransferRequest = require('../models/transferrequest.js');
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


