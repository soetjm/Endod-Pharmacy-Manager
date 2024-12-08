const Sales = require('../models/sales.js');
const Medicine = require('../models/medicine.js');
const Sequelize = require('sequelize');


exports.allRevenuebyate = async(req,res)=>{
    try {
        const salesData = await Sales.findAll({
            attributes: [
                'salesdate',
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalsold'],
                [
                    Sequelize.literal('SUM("quantity" * "unitsellingprice")'),
                    'totalrevenue',
                ],
            ],
            where: {
                salesstatus: 'sold',
            },
            group: ['salesdate'],
            order: [['salesdate', 'DESC']],
        });
        const salesArray = [];//to array format
        salesData.forEach((e) => {
            salesArray.push(e.dataValues);
        });

        if (salesData.length > 0) {
            console.log('Fetched revenue data successfully:', salesArray);
        } else {
            console.log('No sales data found for the specified criteria.');
        }
    } catch (error) {
        console.error('Error fetching revenue data:', error);
    }
}


exports.allRevenubymonth = async (req, res) => {
    try {
        const salesData = await Sales.findAll({
            attributes: [
                [
                    Sequelize.literal('EXTRACT(MONTH FROM "salesdate")::double precision'),
                    'salesmonth',
                ],
                [
                    Sequelize.literal('EXTRACT(YEAR FROM "salesdate")::double precision'),
                    'salesyear',
                ],
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalsold'],
                [
                    Sequelize.literal('SUM("quantity" * "unitsellingprice")'),
                    'totalrevenue',
                ],
            ],
            where: {
                salesstatus: 'sold',
            },
            group: [
                Sequelize.literal('EXTRACT(YEAR FROM "salesdate")'),
                Sequelize.literal('EXTRACT(MONTH FROM "salesdate")'),
            ],
            order: [
                [Sequelize.literal('EXTRACT(YEAR FROM "salesdate")'), 'DESC'],
                [Sequelize.literal('EXTRACT(MONTH FROM "salesdate")'), 'ASC'],
            ],
        });

        const salesArray = [];//to array format
        salesData.forEach((e) => {
            salesArray.push(e.dataValues);
        });

        if (salesData.length > 0) {
            console.log('Fetched monthly revenue data successfully:', salesArray);
            res.json(salesData);
        } else {
            console.log('No sales data found for the specified criteria.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching monthly revenue data:', error);
        res.status(500).send('Internal Server Error'); 
    }
};

exports.allrevenuebymonthyear=async (req, res) => {
    const i_year =(req.body.year); 
    const i_month =(req.body.month); 
    const yearReplaced = i_year.replace(/[^0-9]/g, '');
    const monthReplaced = i_month.replace(/[^0-9]/g, '');

    if(yearReplaced.length== i_year.length && monthReplaced.length== i_month.length){
        try {
            const salesData = await Sales.findAll({
                attributes: [
                    [
                        Sequelize.literal('EXTRACT(MONTH FROM "salesdate")::double precision'),
                        'salesmonth',
                    ],
                    [
                        Sequelize.literal('EXTRACT(YEAR FROM "salesdate")::double precision'),
                        'salesyear',
                    ],
                    [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalsold'],
                    [
                        Sequelize.literal('SUM("quantity" * "unitsellingprice")'),
                        'totalrevenue',
                    ],
                ],
                where:  Sequelize.and(
                    { salesstatus: 'sold' },
                    Sequelize.where(
                        Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "salesdate"')),
                        i_year
                    ),
                    Sequelize.where(
                        Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "salesdate"')),
                        i_month
                    )
                ),
                group: [
                    Sequelize.literal('EXTRACT(YEAR FROM "salesdate")'),
                    Sequelize.literal('EXTRACT(MONTH FROM "salesdate")'),
                ],
                order: [
                    [Sequelize.literal('EXTRACT(YEAR FROM "salesdate")'), 'DESC'],
                    [Sequelize.literal('EXTRACT(MONTH FROM "salesdate")'), 'ASC'],
                ],
            });
    
            
            const salesArray = [];//to array format
            salesData.forEach((e) => {
                salesArray.push(e.dataValues);
            });

            if (salesData.length > 0) {
                console.log('Fetched revenue data for the specified month and year successfully:', salesArray);
                res.json(salesData); 
            } else {
                console.log('No sales data found for the specified month and year.');
                res.json([]); 
            }
        } catch (error) {
            console.error('Error fetching revenue data for the specified month and year:', error);
            res.status(500).send('Internal Server Error'); 
        }   
    }else{
        console.log('your data must be number');
        res.send('your data must be number');
    }
};

exports.allRevenubyyear=async (req, res) => {
    const i_year = req.body.year; 
    const yearReplaced = i_year.replace(/[^0-9]/g, '');
    if(yearReplaced.length== i_year.length){
        try {
            const salesData = await Sales.findAll({
                attributes: [
                    [
                        Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "salesdate"')),
                        'salesmonth',
                    ],
                    [
                        Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "salesdate"')),
                        'salesyear',
                    ],
                    [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalsold'],
                    [
                        Sequelize.literal('SUM("quantity" * "unitsellingprice")'),
                        'totalrevenue',
                    ],
                ],
                where: Sequelize.and(
                    { salesstatus: 'sold' },
                    Sequelize.where(
                        Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "salesdate"')),
                        i_year
                    )
                ),
                group: [
                    Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "salesdate"')),
                    Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "salesdate"')),
                ],
                order: [
                    [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "salesdate"')), 'DESC'],
                    [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "salesdate"')), 'ASC'],
                ],
            });
    
            const salesArray = [];//to array format
            salesData.forEach((e) => {
                salesArray.push(e.dataValues);
            });
    
            if (salesData.length > 0) {
                console.log('Fetched revenue data for the specified year successfully:', salesArray);
                res.json(salesData);
            } else {
                console.log('No sales data found for the specified year.');
                res.json([]);
            }
        } catch (error) {
            console.error('Error fetching revenue data for the specified year:', error);
            res.status(500).send('Internal Server Error');
        }       
    }else{
        console.log('your data must be number');
        res.send('your data must be number');
    }
 
};


exports.allSoldbymonthcode = async (req, res) => {
    try {
        const salesData = await Sales.findAll({
            attributes: [
                [Sequelize.literal('EXTRACT(MONTH FROM "salesdate")'), 'salesmonth'], 
                [Sequelize.literal('EXTRACT(YEAR FROM "salesdate")'), 'salesyear'],  
                'drugcode',
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'TotalSold'], 
                [Sequelize.fn('SUM', Sequelize.literal('"Sales"."quantity" *"Sales". "unitsellingprice"')), 'TotalRevenue'], 
            ],
            include: [
                {
                    model: Medicine,
                    as: 'Medicine',
                    attributes: ['genericname', 'brandname', 'dosage', 'formulation'], 
                    where: {
                        drugstatus: 'active' 
                    }
                }
            ],
            where: {
                salesstatus: 'sold' 
            },
            group: [
                Sequelize.literal('EXTRACT(YEAR FROM "salesdate")'),
                Sequelize.literal('EXTRACT(MONTH FROM "salesdate")'),
                'Sales.drugcode',
                'Medicine.drugcode',
                'Medicine.genericname',
                'Medicine.brandname',
                'Medicine.dosage',
                'Medicine.formulation',
            ],
            order: [
                [Sequelize.literal('EXTRACT(YEAR FROM "salesdate")'), 'DESC'],
                [Sequelize.literal('EXTRACT(MONTH FROM "salesdate")'), 'ASC'],
                ['drugcode', 'ASC'],
            ]
        });

        const salesArray = salesData.map((sale) => sale.dataValues);

        if (salesArray.length > 0) {
            console.log('Fetched sales data successfully:', salesArray);
            res.json(salesArray); 
        } else {
            console.log('No sales data found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.getSalesid = async (req, res) => {
    try {
        let nextSalesRId;
        const salseExists = await Sales.findOne({
            where: { salesid: 1 },
        });
        if (salseExists) {
            const maxIdResult = await Sales.findOne({
                attributes: [[Sequelize.fn('MAX', Sequelize.col('salesid')), 'maxValue']],
            });
            nextSalesRId = (Number(maxIdResult.dataValues.maxValue) || 0) + 1;
        } else {
            nextSalesRId = 1;
        }

        console.log('Next PurchaseRId:', nextSalesRId);
        res.json({ nextSalesRId });
    } catch (error) {
        console.error('Error fetching next PurchaseRId:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listAllrevenueformonthyear = async (req, res) => {
    const { year, month } = req.body; 

    try {
        const revenueData = await Sales.findAll({
            attributes: [
                [
                    Sequelize.literal('EXTRACT(DAY FROM "salesdate")::double precision'),
                    'salesday',
                ],
                [
                    Sequelize.literal('EXTRACT(YEAR FROM "salesdate")::double precision'),
                    'salesyear',
                ],
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalsold'],
                [
                    Sequelize.literal('SUM("quantity" * "unitsellingprice")'),
                    'totalrevenue',
                ],
            ],
            where: {
                salesstatus: 'sold',
                [Sequelize.Op.and]: [
                    Sequelize.literal(`EXTRACT(YEAR FROM "salesdate") = ${year}`),
                    Sequelize.literal(`EXTRACT(MONTH FROM "salesdate") = ${month}`),
                ],
            },
            group: [
                Sequelize.literal('EXTRACT(DAY FROM "salesdate")'),
                Sequelize.literal('EXTRACT(MONTH FROM "salesdate")'),
                Sequelize.literal('EXTRACT(YEAR FROM "salesdate")'),
            ],
            order: [
                [Sequelize.literal('EXTRACT(YEAR FROM "salesdate")'), 'DESC'],
                [Sequelize.literal('EXTRACT(MONTH FROM "salesdate")'), 'ASC'],
                [Sequelize.literal('EXTRACT(DAY FROM "salesdate")'), 'DESC'],
            ],
        });

        const revenueArray = revenueData.map((data) => data.dataValues);

        if (revenueData.length > 0) {
            console.log('Fetched monthly revenue data successfully:', revenueArray);
            res.json(revenueArray); 
        } else {
            console.log('No revenue data found for the specified criteria.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching revenue data:', error);
        res.status(500).send('Internal Server Error');
    }
};






    
