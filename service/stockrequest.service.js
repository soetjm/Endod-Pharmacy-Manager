const StockRequest = require('../models/stockrequest.js');
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