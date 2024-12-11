const DisposableMedicine =require('../models/disposablemedicine.js');
const Medicine = require('../models/medicine.js');
const Sequelize = require('sequelize');


exports.countunApproveddisposable = async (req, res) => {
    try {
        const unapprovedCount = await DisposableMedicine.count({
            where: {
                damagestatus: 'pending',
            },
        });

        console.log('Unapproved disposable count:', unapprovedCount.dataValues);
        res.json({ unapprovedCount }); 
    } catch (error) {
        console.error('Error fetching unapproved disposable count:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listUnapproveddisposable = async (req, res) => {
    try {
        
        const unapprovedDisposable = await DisposableMedicine.findAll({
            attributes: [
                'dId',
                'drugcode',
                'batchno',
                'quantity',
                'damagedfrom',
                'damagedate',
                'reportedby',
                'remark'
            ],
            include: [
                {
                    model: Medicine,
                    attributes: [
                        'genericname',
                        'brandname',
                        'dosage',
                        'formulation',
                        'unit'
                    ],
                    where: {
                        drugstatus: 'active' 
                    },
                    required: true 
                }
            ],
            where: {
                damagestatus: 'pending' 
            },
            order: [
                ['DamageDate', 'DESC'],
                ['DrugCode', 'ASC']
            ]
        });

        const result = unapprovedDisposable.map((d) => {
            const { Medicine: medicineData, ...disposableData } = d.dataValues;
            return {
                ...disposableData,
                ...medicineData 
            };
        });

        if (result.length > 0) {
            console.log('Fetched unapproved disposable medicines successfully:', result);
            res.json(result); 
        } else {
            console.log('No unapproved disposable medicines found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching unapproved disposable medicines:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listApproveddisposable = async (req, res) => {
    try {
        const disposableMedicines = await DisposableMedicine.findAll({
            attributes: [
                'did',
                'drugcode',
                'batchno',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'quantity',
                'damagedfrom',
                'damagedate',
                'reportedby',
                'remark'
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
                damagestatus: 'approved'
            },
            order: [
                ['damagedate', 'DESC'],
                ['drugcode', 'ASC']
            ],
            raw: true
        });

        res.json(disposableMedicines);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

exports.listUnapproveddisposable = async (req, res) => {
    try {
        const unapprovedDisposables = await DisposableMedicine.findAll({
            attributes: [
                'did',
                'drugcode',
                'batchno',
                [Sequelize.col('Medicine.genericname'), 'GenericName'],
                [Sequelize.col('Medicine.brandname'), 'BrandName'],
                [Sequelize.col('Medicine.dosage'), 'Dosage'],
                [Sequelize.col('Medicine.formulation'), 'Formulation'],
                [Sequelize.col('Medicine.unit'), 'Unit'],
                'quantity',
                'damagedfrom',
                'damagedate',
                'reportedby',
                'remark'
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
                damagestatus: 'pending'
            },
            order: [
                ['damagedate', 'DESC'],
                ['drugcode', 'ASC']
            ],
            raw: true
        });

        res.json(unapprovedDisposables);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};