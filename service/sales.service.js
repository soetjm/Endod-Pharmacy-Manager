const Sales = require('../models/sales.js');
const Medicine = require('../models/medicine.js');
const BookLog = require('../models/booklog.js');
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


exports.listAllsalemonths = async (req, res) => {
    try {
        const salesMonths = await Sales.findAll({
            attributes: [
                [Sequelize.literal('EXTRACT(MONTH FROM "salesdate")'), 'salesmonth']
            ],
            include: [
                {
                    model: Medicine,
                    attributes: [],
                    required: true,
                    where: {
                        drugstatus: 'active'
                    }
                }
            ],
            where: {
                salesstatus: 'sold'
            }
        });

        res.json(salesMonths.map(month => month.dataValues));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


exports.listAllsales = async (req, res) => {
    try {
        const salesData = await Sales.findAll({
            attributes: [
                'salesid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'genericname'],
                [Sequelize.col('Medicine.brandname'), 'brandname'],
                [Sequelize.col('Medicine.dosage'), 'dosage'],
                [Sequelize.col('Medicine.formulation'), 'formulation'],
                'quantity',
                [Sequelize.col('Medicine.unit'), 'unit'],
                [Sequelize.col('Sales.unitsellingprice'), 'unitSellingPrice'],
                [Sequelize.literal('"Sales"."quantity" *"Sales"."unitsellingprice"'), 'totalprice'],
                'salesdate',
                'dispensedby',
                'salesstatus'
            ],
            include: [
                {
                    model: Medicine,
                    attributes: [],
                    required: true,
                    where: {
                        drugstatus: 'active'
                    }
                }
            ],
            where: {
                salesstatus: 'sold'
            },
            order: [
                ['salesstatus', 'DESC'],
                ['salesdate', 'DESC']
            ]
        });

        res.json(salesData.map(sale => sale.dataValues));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.listAllsalesforyearmonth = async (req, res) => {
    const { month,year} = req.body; 

    if(!month || !year){
        res.json({message:'please fill both year and month'});
        return;
    }

    try {
        const salesData = await Sales.findAll({
            attributes: [
                'salesid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'genericname'],
                [Sequelize.col('Medicine.brandname'), 'brandname'],
                [Sequelize.col('Medicine.dosage'), 'dosage'],
                [Sequelize.col('Medicine.formulation'), 'formulation'],
                'quantity',
                [Sequelize.col('Medicine.unit'), 'unit'],
                [Sequelize.col('Sales.unitsellingprice'), 'unitSellingPrice'],
                [Sequelize.literal('"Sales"."quantity" *"Sales"."unitsellingprice"'), 'totalprice'],
                'salesdate',
                'dispensedby',
                'salesstatus'
            ],
            include: [
                {
                    model: Medicine,
                    attributes: [],
                    required: true,
                    where: {
                        drugstatus: 'active'
                    }
                }
            ],
            where: {
                salesstatus: 'sold',
                [Sequelize.Op.and]: [
                    Sequelize.literal(`EXTRACT(YEAR FROM "salesdate") = ${year}`),
                    Sequelize.literal(`EXTRACT(MONTH FROM "salesdate") = ${month}`),
                ],
            },
            order: [
                ['salesstatus', 'DESC'],
                ['salesdate', 'DESC']
            ]
        });

        res.json(salesData.map(sale => sale.dataValues));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.listAllsaleyears =async (req, res) => {
    try {
        const salesYears = await Sales.findAll({
            attributes: [
                [Sequelize.literal('EXTRACT(YEAR FROM "salesdate")::INT'), 'salesyear']
            ],
            include: [{
                model: Medicine,
                where: {
                    drugstatus: 'active'
                },
                required: true // Ensures that only records with matching Medicine entries are included
            }],
            where: {
                salesstatus: 'sold'
            },
            // group: [
            //     Sequelize.literal('EXTRACT(YEAR FROM "salesdate")')
            // ],
        });

        const salesYearsArray = salesYears.map(year => year.dataValues.salesyear);

        res.json(salesYearsArray);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listReturnedsales = async (req, res) => {
    try {
        const returnedSales = await Sales.findAll({
            attributes: [
                'salesid',
                'drugcode',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                'quantity',
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'unitsellingprice',
                [Sequelize.literal('"Sales"."quantity" *"Sales"."unitsellingprice"'), 'TPrice'],
                'salesdate',
                'dispensedby',
                'salesstatus'
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
                salesstatus: 'returned'
            },
            order: [
                ['salesdate', 'DESC']
            ],
            raw: true
        });

        res.json(returnedSales);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.salesNotrecorded = async (req, res) => {
    try {
        const unrecordedSales = await Sales.findAll({
            attributes: [
                ['salesid', 'salesid'],
                ['drugcode', 'drugcode'],
                [Sequelize.col('Medicine.genericname'), 'genericname'],
                [Sequelize.col('Medicine.brandname'), 'brandname'],
                [Sequelize.col('Medicine.dosage'), 'dosage'],
                [Sequelize.col('Medicine.formulation'), 'formulation'],
                ['quantity', 'quantity'],
                [Sequelize.col('Medicine.unit'), 'unit'],
                ['unitsellingprice', 'unitsellingprice'],
                [
                    Sequelize.literal('"Sales"."quantity" * "Sales"."unitsellingprice"'),
                    'totalprice'
                ],
                ['salesdate', 'salesdate'],
                ['dispensedby', 'dispensedby'],
                ['salesstatus', 'salesstatus']
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
                salesstatus: 'sold',
            },
            raw: true
        });
        const recordinBookLog = await BookLog.findAll({
            attributes: [
                ['salesid', 'salesid'],
                ['drugcode', 'drugcode'],
            ],
        })
        const recordArray = [];
        recordinBookLog.forEach(record => {
            recordArray.push(record.dataValues);
        })
        const arrayResult = unrecordedSales.filter(itemOne =>
            !recordArray.some(itemTwo => 
                itemTwo.salesid === itemOne.salesid 
            )
        );
        res.json(arrayResult);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


/**
 * 
 * @Important week is not defined in database
 */
exports.selectRevenueByWeek = async (req, res) => {
    const { week, year } = req.body;

    try {
        const revenueByWeek = await Sales.findAll({
            attributes: [
                [
                    Sequelize.literal('EXTRACT(ISODOW FROM "salesdate")::double precision'),
                    'salesday'
                ],
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalsold'],
                [
                    Sequelize.literal('SUM("quantity" * "unitsellingprice")'),
                    'totalrevenue'
                ]
            ],
            where: Sequelize.and(
                { salesstatus: 'sold' },
                Sequelize.literal(`EXTRACT(YEAR FROM "salesdate") = ${year}`),
                Sequelize.literal(`EXTRACT(WEEK FROM "salesdate") = ${week}`)
            ),
            group: [
                Sequelize.literal('EXTRACT(ISODOW FROM "salesdate")')
            ],
            order: [
                [Sequelize.literal('EXTRACT(ISODOW FROM "salesdate")'), 'ASC']
            ],
            raw: true
        });

        res.json(revenueByWeek);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


exports.selectMonthlySales = async (req, res) => {
    const { year, month } = req.body;

    try {
        const monthlySales = await Sales.findAll({
            attributes: [
                ['drugcode', 'drugcode'],
                [Sequelize.col('Medicine.genericname'), 'genericname'],
                [Sequelize.col('Medicine.brandname'), 'brandname'],
                [Sequelize.col('Medicine.dosage'), 'dosage'],
                [Sequelize.col('Medicine.formulation'), 'formulation'],
                [Sequelize.literal('SUM("Sales"."quantity")'), 'tquantity'],
                [Sequelize.literal('SUM("Sales"."quantity" * "Sales"."unitsellingprice")'), 'tprice']
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
            where: Sequelize.and(
                { salesstatus: 'sold' },
                Sequelize.literal(`EXTRACT(YEAR FROM "salesdate") = ${year}`),
                Sequelize.literal(`EXTRACT(MONTH FROM "salesdate") = ${month}`)
            ),
            group: [
                'Sales.drugcode',
                'Medicine.genericname',
                'Medicine.brandname',
                'Medicine.dosage',
                'Medicine.formulation'
            ],
            order: [
                [Sequelize.literal('SUM("Sales"."quantity")'), 'DESC']
            ],
            raw: true
        });

        res.json(monthlySales);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.selectSoldbyweekcode =async (req, res) => {
    const { week, year } = req.body;

    try {
        const soldByWeekCode = await Sales.findAll({
            attributes: [
                'Sales.drugcode',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.fn('SUM', Sequelize.col('Sales.quantity')), 'TQuantity'],
                [
                    Sequelize.fn(
                        'SUM',
                        Sequelize.literal('"Sales"."quantity" * "Sales"."unitsellingprice"')
                    ),
                    'TotalRevenue',
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
            where: Sequelize.and(
                { salesstatus: 'sold' },
                Sequelize.literal(`EXTRACT(YEAR FROM "salesdate") = ${year}`),
                Sequelize.literal(`EXTRACT(WEEK FROM "salesdate") = ${week}`)
            ),
            group: [
                'Sales.drugcode',
                'Medicine.genericname',
                'Medicine.brandname',
                'Medicine.dosage',
                'Medicine.formulation',
            ],
            order: [[Sequelize.fn('SUM', Sequelize.col('Sales.quantity')), 'DESC']],
            raw: true,
        });

        res.json(soldByWeekCode);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};








    
