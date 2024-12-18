const Medicine = require('../models/medicine.js');
const {Sequelize,QueryTypes} = require('sequelize');
const sequelize = require('../utils/dbconnection.js')


exports.addMedicen = async (req,res)=>{
    const drugCode  = req.body.drugcode;
    const genericName = req.body.genericname;
    const brandName = req.body.brandname;
    const dosage = req.body.dosage;
    const formualtion = req.body.formualtion;
    const classification = req.body.classification;
    const unit = req.body.unit;
    const unitSellingPrice = Number(req.body.unitsellingprice) ? req.body.unitsellingprice:null;
    const medicine =await Medicine.findOne({where:{drugcode:drugCode}});
    if(medicine==null){
        const ifAllexist = await Medicine.findOne({
            where:{
                genericname:genericName,
                brandname:brandName,
                dosage:dosage,
                formulation:formualtion,
                classification:classification,
                unit:unit,
            }
        });
        console.log(ifAllexist,'from if all exist')
        if(ifAllexist == null){
            Medicine.create({
                drugcode:drugCode,
                genericname:genericName,
                brandname:brandName,
                dosage:dosage,
                formulation:formualtion,
                classification:classification,
                unit:unit,
                unitsellingprice:unitSellingPrice
            }).then(result=>{
                console.log(1,'create mediicen');
            }).catch(err=>{
                console.log('error occure when try to add mecien',err);
            })
        }else{
            console.log(-2,'this medicin is alrady exist');
        }
    }else{
        console.log(-1,'drug code alrady available');
    }

}


exports.listAllactivecodes = async (req, res) => {
    try {
        const activeDrugCodes = await Medicine.findAll({
            attributes: ['drugcode'],
            where: {
                drugstatus: 'active',
            },
        });

        const drugCodesArray = activeDrugCodes.map((medicine) => medicine.drugcode);

        if (activeDrugCodes.length > 0) {
            console.log('Fetched active drug codes successfully:', drugCodesArray);
            res.json(drugCodesArray); 
        } else {
            console.log('No active drug codes found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching active drug codes:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listAllactivemedicines = async (req, res) => {
    try {
        const activeMedicines = await Medicine.findAll({
            attributes: [
                'drugcode',
                'genericname',
                'brandname',
                'dosage',
                'formulation',
                'classification',
                'unit',
                'unitsellingprice',
                'sharestatus',
            ],
            where: {
                drugstatus: 'active',
            },
        });

        const medicinesArray = activeMedicines.map((medicine) => medicine.dataValues);

        if (activeMedicines.length > 0) {
            console.log('Fetched active medicines successfully:', medicinesArray);
            res.json(medicinesArray); 
        } else {
            console.log('No active medicines found.');
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching active medicines:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listAllsharedmedicines = async (req, res) => {
    try {
        const activeMedicines = await Medicine.findAll({
            attributes: [
                'drugcode',
                'genericname',
                'brandname',
                'dosage',
                'formulation',
                'classification',
                'unit',
                'unitsellingprice',
                'sharestatus',
            ],
            where: {
                drugstatus: 'active',
                sharestatus: 'shared'
            },
        });

        const medicinesArray = activeMedicines.map((medicine) => medicine.dataValues);

        if (activeMedicines.length > 0) {
            console.log('Fetched active medicines successfully:', medicinesArray);
            res.json(medicinesArray); 
        } else {
            console.log('No active medicines found.');
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching active medicines:', error);
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

exports.searchBybrand = async (req, res) => {
    const { brandname } = req.body;
    if(!brandname){
        res.json({message:'undedined brandname'});
        return;
    }
    try {
        const medicines = await Medicine.findAll({
            attributes: [
                ['drugcode', 'drugcode'],
                ['genericname', 'genericname'],
                ['brandname', 'brandname'],
                ['dosage', 'dosage'],
                ['formulation', 'formulation'],
                ['classification', 'classification'],
                ['unit', 'unit'],
                ['unitsellingprice', 'unitsellingprice'],
                ['sharestatus', 'sharestatus']
            ],
            where: {
                drugstatus: 'active',
                brandname: {
                    [Sequelize.Op.iLike]: `%${brandname}%`  
                }
            },
            raw: true
        });

        res.json(medicines);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchBydrugcode = async (req, res) => {
    const { drugcode } = req.body;
    if(!drugcode){
        res.json({message:'undedined drugcode'});
        return;
    }
    try {
        const medicines = await Medicine.findAll({
            attributes: [
                ['drugcode', 'drugcode'],
                ['genericname', 'genericname'],
                ['brandname', 'brandname'],
                ['dosage', 'dosage'],
                ['formulation', 'formulation'],
                ['classification', 'classification'],
                ['unit', 'unit'],
                ['unitsellingprice', 'unitsellingprice'],
                ['sharestatus', 'sharestatus']
            ],
            where: {
                drugstatus: 'active',
                drugcode: {
                    [Sequelize.Op.iLike]: `%${drugcode}%`  
                }
            },
            raw: true
        });

        res.json(medicines);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchBygeneric = async (req, res) => {
    const { genericname } = req.body;
    if(!genericname){
        res.json({message:'undedined genericname'});
        return;
    }
    try {
        const medicines = await Medicine.findAll({
            attributes: [
                ['drugcode', 'drugcode'],
                ['genericname', 'genericname'],
                ['brandname', 'brandname'],
                ['dosage', 'dosage'],
                ['formulation', 'formulation'],
                ['classification', 'classification'],
                ['unit', 'unit'],
                ['unitsellingprice', 'unitsellingprice'],
                ['sharestatus', 'sharestatus']
            ],
            where: {
                drugstatus: 'active',
                genericname: {
                    [Sequelize.Op.iLike]: `%${genericname}%`  
                }
            },
            raw: true
        });

        res.json(medicines);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.selectMedicineDetails = async (req, res) => {
    const { drugcode } = req.body;

    try {
        const medicineDetails = await Medicine.findAll({
            attributes: [
                ['drugcode', 'drugcode'],
                ['genericname', 'genericname'],
                ['brandname', 'brandname'],
                ['dosage', 'dosage'],
                ['formulation', 'formulation'],
                ['classification', 'classification'],
                ['unit', 'unit'],
                ['unitsellingprice', 'unitsellingprice'],
                ['sharestatus', 'sharestatus']
            ],
            where: {
                drugstatus: 'active',
                drugcode: drugcode
            },
            raw: true
        });

        res.json(medicineDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


exports.viewStorestockcardbatch = async (req, res) => {
    const { drugcode } = req.body;

    try {


        res.json(stockCardBatch);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listSharedAvailableDrugs = async (req,res) => {
    try {
        // Use raw query to fetch data from the view and join with Medicine table
        const drugs = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.StoreQuantity AS storequantity,
                v.DispensaryQuantity AS dispensaryquantity,
                v.TotalQuantity AS totalquantity,
                m.ShareStatus AS sharestatus,
                m.classification
            FROM vwAllPharmacyDrugs v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND v.TotalQuantity > 0
            AND m.ShareStatus = 'shared'
            ORDER BY v.DrugCode, v.TotalQuantity;
        `, {
            type: QueryTypes.SELECT,
        });

        res.json(drugs);
    } catch (error) {
        console.error('Error fetching shared available drugs:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listMinMaxMedicineCost = async (req, res) => {
    try {
        // Use raw query to fetch data from the view and join with Medicine table
        const medicines = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                v.MinCost AS mincost,
                v.MaxCost AS maxcost
            FROM vwMinMaxMedicineCost v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active';
        `, {
            type: QueryTypes.SELECT,
        });

        res.json(medicines);
    } catch (error) {
        console.error('Error fetching min/max medicine cost:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getMinMaxMedicineCostByDrugCode = async (req, res) => {
    try {
        const  drugcode  = req.params.drugcode;

        console.log(drugcode);
        
        if (!drugcode) {
            return res.status(400).json({ error: 'Drug code is required' });
        }

        const medicine = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.Classification AS classification,
                v.MinCost AS mincost,
                v.MaxCost AS maxcost,
                m.UnitSellingPrice AS sellingprice
            FROM vwMinMaxMedicineCost v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND v.DrugCode = :drugcode;
        `, {
            type: QueryTypes.SELECT,
            replacements: { drugcode },
        });

        if (!medicine.length) {
            return res.status(404).json({ error: 'No data found for the given drug code' });
        }

        res.json(medicine);
    } catch (error) {
        console.error('Error fetching min/max medicine cost by drug code:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchDispensaryStockByBrand = async (req, res) => {
    try {
        const { brandname } = req.params;

        if (!brandname) {
            return res.status(400).json({ error: 'Brand name is required' });
        }

        const stock = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.CurrentQuantity AS availablequantity
            FROM vwDispensaryStockcard v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND LOWER(m.BrandName) LIKE LOWER(:brandname)
            AND v.CurrentQuantity > 0
            ORDER BY m.BrandName, v.CurrentQuantity DESC;
        `, {
            type: QueryTypes.SELECT,
            replacements: { brandname: `%${brandname}%` },
        });

        if (!stock.length) {
            return res.status(404).json({ error: 'No data found for the given brand name' });
        }

        res.json(stock);
    } catch (error) {
        console.error('Error searching dispensary stock by brand:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchDispensaryStockByCode = async (req, res) => {
    try {
        const { drugcode } = req.params;

        if (!drugcode) {
            return res.status(400).json({ error: 'Drug code is required' });
        }

        const stock = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.CurrentQuantity AS availablequantity
            FROM vwDispensaryStockcard v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND LOWER(v.DrugCode) LIKE LOWER(:drugcode)
            AND v.CurrentQuantity > 0
            ORDER BY v.DrugCode, v.CurrentQuantity DESC;
        `, {
            type: QueryTypes.SELECT,
            replacements: { drugcode: `%${drugcode}%` },
        });

        if (!stock.length) {
            return res.status(404).json({ error: 'No data found for the given drug code' });
        }

        res.json(stock);
    } catch (error) {
        console.error('Error searching dispensary stock by drug code:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.searchDispensaryStockByGeneric = async (req, res) => {
    try {
        const { genericname } = req.params;

        if (!genericname) {
            return res.status(400).json({ error: 'Generic name is required' });
        }

        const stock = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.CurrentQuantity AS availablequantity
            FROM vwDispensaryStockcard v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND LOWER(m.GenericName) LIKE LOWER(:genericname)
            AND v.CurrentQuantity > 0
            ORDER BY m.GenericName, v.CurrentQuantity DESC;
        `, {
            type: QueryTypes.SELECT,
            replacements: { genericname: `%${genericname}%` },
        });

        if (!stock.length) {
            return res.status(404).json({ error: 'No data found for the given generic name' });
        }

        res.json(stock);
    } catch (error) {
        console.error('Error searching dispensary stock by generic name:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchStoreStockByBrand = async (req, res) => {
    try {
        const { brandname } = req.params;

        if (!brandname) {
            return res.status(400).json({ error: 'Brand name is required' });
        }

        const stock = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.CurrentQuantity AS availablequantity
            FROM vwStoreStockcardByCode v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND LOWER(m.BrandName) LIKE LOWER(:brandname)
            AND v.CurrentQuantity > 0
            ORDER BY m.BrandName, v.CurrentQuantity DESC;
        `, {
            type: QueryTypes.SELECT,
            replacements: { brandname: `%${brandname}%` },
        });

        if (!stock.length) {
            return res.status(404).json({ error: 'No data found for the given brand name' });
        }

        res.json(stock);
    } catch (error) {
        console.error('Error searching store stock by brand:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchStoreStockByCode = async (req, res) => {
    try {
        const { drugcode } = req.params;

        if (!drugcode) {
            return res.status(400).json({ error: 'Drug code is required' });
        }

        const stock = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.CurrentQuantity AS availablequantity
            FROM vwStoreStockcardByCode v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND LOWER(v.DrugCode) LIKE LOWER(:drugcode)
            AND v.CurrentQuantity > 0
            ORDER BY v.DrugCode, v.CurrentQuantity DESC;
        `, {
            type: QueryTypes.SELECT,
            replacements: { drugcode: `%${drugcode}%` },
        });

        if (!stock.length) {
            return res.status(404).json({ error: 'No data found for the given drug code' });
        }

        res.json(stock);
    } catch (error) {
        console.error('Error searching store stock by drug code:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchStoreStockByGeneric = async (req, res) => {
    try {
        const { genericname } = req.params;

        if (!genericname) {
            return res.status(400).json({ error: 'Generic name is required' });
        }

        const stock = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.CurrentQuantity AS availablequantity
            FROM vwStoreStockcardByCode v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND LOWER(m.GenericName) LIKE LOWER(:genericname)
            AND v.CurrentQuantity > 0
            ORDER BY m.GenericName, v.CurrentQuantity DESC;
        `, {
            type: QueryTypes.SELECT,
            replacements: { genericname: `%${genericname}%` },
        });

        if (!stock.length) {
            return res.status(404).json({ error: 'No data found for the given generic name' });
        }

        res.json(stock);
    } catch (error) {
        console.error('Error searching store stock by generic name:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchTransferableStockByBrand = async (req, res) => {
    try {
        const { brandname } = req.params;

        if (!brandname) {
            return res.status(400).json({ error: 'Brand name is required' });
        }

        const stock = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.CurrentQuantity AS availablequantity
            FROM vwtransferebalestock v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND LOWER(m.BrandName) LIKE LOWER(:brandname)
            AND v.CurrentQuantity > 0
            ORDER BY v.CurrentQuantity, v.DrugCode;
        `, {
            type: QueryTypes.SELECT,
            replacements: { brandname: `%${brandname}%` },
        });

        if (!stock.length) {
            return res.status(404).json({ error: 'No data found for the given brand name' });
        }

        res.json(stock);
    } catch (error) {
        console.error('Error searching transferable stock by brand:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchTransferableStockByCode = async (req, res) => {
    try {
        const { drugcode } = req.params;

        if (!drugcode) {
            return res.status(400).json({ error: 'Drug code is required' });
        }

        const stock = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.CurrentQuantity AS availablequantity
            FROM vwtransferebalestock v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND LOWER(v.DrugCode) LIKE LOWER(:drugcode)
            AND v.CurrentQuantity > 0
            ORDER BY v.CurrentQuantity, v.DrugCode;
        `, {
            type: QueryTypes.SELECT,
            replacements: { drugcode: `%${drugcode}%` },
        });

        if (!stock.length) {
            return res.status(404).json({ error: 'No data found for the given drug code' });
        }

        res.json(stock);
    } catch (error) {
        console.error('Error searching transferable stock by drug code:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchTransferableStockByGeneric = async (req, res) => {
    try {
        const { genericname } = req.params;

        if (!genericname) {
            return res.status(400).json({ error: 'Generic name is required' });
        }

        const stock = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.CurrentQuantity AS availablequantity
            FROM vwtransferebalestock v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND LOWER(m.GenericName) LIKE LOWER(:genericname)
            AND v.CurrentQuantity > 0
            ORDER BY v.CurrentQuantity, v.DrugCode;
        `, {
            type: QueryTypes.SELECT,
            replacements: { genericname: `%${genericname}%` },
        });

        if (!stock.length) {
            return res.status(404).json({ error: 'No data found for the given generic name' });
        }

        res.json(stock);
    } catch (error) {
        console.error('Error searching transferable stock by generic name:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.selectAvailableDrug = async (req, res) => {
    try {
        const { drugcode } = req.params;

        if (!drugcode) {
            return res.status(400).json({ error: 'Drug code is required' });
        }

        const drug = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.StoreQuantity AS storequantity,
                v.DispensaryQuantity AS dispensaryquantity,
                v.TotalQuantity AS totalquantity,
                m.ShareStatus AS sharestatus
            FROM vwAllPharmacyDrugs v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND v.DrugCode = :drugcode
            AND v.TotalQuantity > 0;
        `, {
            type: QueryTypes.SELECT,
            replacements: { drugcode: drugcode },
        });

        if (!drug.length) {
            return res.status(404).json({ error: 'No data found for the given drug code' });
        }

        res.json(drug);
    } catch (error) {
        console.error('Error selecting available drug:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewAllAvailableDrugs = async (req, res) => {
    try {
        const drugs = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.StoreQuantity AS storequantity,
                v.DispensaryQuantity AS dispensaryquantity,
                v.TotalQuantity AS totalquantity,
                m.ShareStatus AS sharestatus,
                m.Classification AS classification
            FROM vwAllPharmacyDrugs v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND v.TotalQuantity > 0
            ORDER BY v.DrugCode, v.TotalQuantity;
        `, {
            type: QueryTypes.SELECT,
        });

        if (!drugs.length) {
            return res.status(404).json({ error: 'No available drugs found' });
        }

        res.json(drugs);
    } catch (error) {
        console.error('Error fetching available drugs:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.viewAllPharmacyDrugs = async (req, res) => {
    try {
        const drugs = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                v.StoreQuantity AS storequantity,
                v.DispensaryQuantity AS dispensaryquantity,
                v.TotalQuantity AS totalquantity,
                m.ShareStatus AS sharestatus,
                m.Classification AS classification
            FROM vwAllPharmacyDrugs v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            ORDER BY v.DrugCode, v.TotalQuantity;
        `, {
            type: QueryTypes.SELECT,
        });

        if (!drugs.length) {
            return res.status(404).json({ error: 'No pharmacy drugs found' });
        }

        res.json(drugs);
    } catch (error) {
        console.error('Error fetching pharmacy drugs:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewAllTockOutDrugs = async (req, res) => {
    try {
        const drugs = await sequelize.query(`
            SELECT 
                v.DrugCode AS drugcode,
                m.GenericName AS genericname,
                m.BrandName AS brandname,
                m.Dosage AS dosage,
                m.Formulation AS formulation,
                m.Unit AS unit,
                m.UnitSellingPrice AS unitsellingprice,
                m.ShareStatus AS sharestatus
            FROM vwAllPharmacyDrugs v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active' AND v.TotalQuantity <= 0
            ORDER BY v.DrugCode;
        `, {
            type: QueryTypes.SELECT,
        });

        if (!drugs.length) {
            return res.status(404).json({ error: 'No tock-out drugs found' });
        }

        res.json(drugs);
    } catch (error) {
        console.error('Error fetching tock-out drugs:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewDispensaryActiveBatches = async (req, res) => {
    try {
        const { drugcode } = req.params;

        const batches = await sequelize.query(`
            SELECT DISTINCT 
                v.batchno 
            FROM vwpharmacydispensary v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND v.batchstatus = 'active'
            AND v.drugcode = :drugcode;
        `, {
            replacements: { drugcode },
            type: QueryTypes.SELECT,
        });

        if (!batches.length) {
            return res.status(404).json({ error: 'No active batches found for the given drug code' });
        }

        res.json(batches);
    } catch (error) {
        console.error('Error fetching active batches:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewDispensaryActiveBatchesWithExpiry = async (req, res) => {
    try {
        const { drugcode } = req.params;

        const batches = await sequelize.query(`
            SELECT DISTINCT 
                v.batchno,
                v.expirydate
            FROM vwpharmacydispensary v
            INNER JOIN medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND v.batchstatus = 'active'
            AND v.drugcode = :drugcode;
        `, {
            replacements: { drugcode },
            type: QueryTypes.SELECT,
        });

        if (!batches.length) {
            return res.status(404).json({ error: 'No active batches with expiry found for the given drug code' });
        }

        res.json(batches);
    } catch (error) {
        console.error('Error fetching active batches with expiry:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewDispensaryStock = async (req, res) => {
    try {
        const stockData = await sequelize.query(`
            SELECT 
                v.DrugCode,
                m.GenericName,
                m.BrandName,
                m.Dosage,
                m.Formulation,
                m.Unit,
                m.UnitSellingPrice,
                v.CurrentQuantity,
                CASE 
                    WHEN v.CurrentQuantity > 0 THEN 'available'
                    ELSE 'stock out'
                END AS stockstatus
            FROM vwDispensaryStockcard v
            INNER JOIN Medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active' 
            AND v.CurrentQuantity > 0
            ORDER BY v.CurrentQuantity, v.DrugCode;
        `, {
            type: QueryTypes.SELECT,
        });

        if (!stockData.length) {
            return res.status(404).json({ error: 'No available stock found' });
        }

        res.json(stockData);
    } catch (error) {
        console.error('Error fetching dispensary stock:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewDispensaryStockCard = async (req, res) => {
    try {
        const stockCardData = await sequelize.query(`
            SELECT 
                v.DrugCode,
                m.GenericName,
                m.BrandName,
                m.Dosage,
                m.Formulation,
                m.Unit,
                m.UnitSellingPrice,
                v.CurrentQuantity,
                CASE 
                    WHEN v.CurrentQuantity > 0 THEN 'available'
                    ELSE 'stock out'
                END AS stockstatus
            FROM vwDispensaryStockcard v
            INNER JOIN Medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            ORDER BY v.CurrentQuantity, v.DrugCode;
        `, {
            type: QueryTypes.SELECT,
        });

        if (!stockCardData.length) {
            return res.status(404).json({ error: 'No stock card data found' });
        }

        res.json(stockCardData);
    } catch (error) {
        console.error('Error fetching dispensary stock card:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewInStore = async (req, res) => {
    try {
        const inStoreData = await sequelize.query(`
            SELECT 
                v.DrugCode,
                m.GenericName,
                m.BrandName,
                m.Dosage,
                m.Formulation,
                m.Unit,
                m.UnitSellingPrice,
                v.CurrentQuantity
            FROM vwStoreStockCardByCode v
            INNER JOIN Medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active' 
            AND v.CurrentQuantity > 0
            ORDER BY v.CurrentQuantity, v.DrugCode;
        `, {
            type: QueryTypes.SELECT,
        });

        if (!inStoreData.length) {
            return res.status(404).json({ error: 'No drugs in store found' });
        }

        res.json(inStoreData);
    } catch (error) {
        console.error('Error fetching drugs in store:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewStoreStock = async (req, res) => {
    try {
        const storeStockData = await sequelize.query(`
            SELECT 
                v.DrugCode,
                v.BatchNo,
                m.GenericName,
                m.BrandName,
                m.Dosage,
                m.Formulation,
                m.Unit,
                m.UnitSellingPrice,
                v.CurrentQuantity,
                v.ExpiryDate
            FROM vwStoreStockCardByBatch v
            INNER JOIN Medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND v.CurrentQuantity > 0
            ORDER BY v.CurrentQuantity, v.DrugCode;
        `, {
            type: QueryTypes.SELECT,
        });

        if (!storeStockData.length) {
            return res.status(404).json({ error: 'No store stock data found' });
        }

        res.json(storeStockData);
    } catch (error) {
        console.error('Error fetching store stock data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewStoreStockCard = async (req, res) => {
    try {
        const storeStockCardData = await sequelize.query(`
            SELECT 
                v.DrugCode,
                m.GenericName,
                m.BrandName,
                m.Dosage,
                m.Formulation,
                m.Unit,
                m.UnitSellingPrice,
                v.CurrentQuantity,
                (CASE WHEN v.CurrentQuantity > 0 THEN 'available'
                      ELSE 'stock out'
                 END) AS status
            FROM vwStoreStockcardByCode v
            INNER JOIN Medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            ORDER BY v.CurrentQuantity, v.DrugCode;
        `, {
            type: QueryTypes.SELECT,
        });

        if (!storeStockCardData.length) {
            return res.status(404).json({ error: 'No store stock card data found' });
        }

        res.json(storeStockCardData);
    } catch (error) {
        console.error('Error fetching store stock card data:', error);
        res.status(500).send('Internal Server Error');
    }
};

/**
 * 
 *   
 * @Important stockCardBatch is not defined in @method viewStoreStockCardBatch
 * 
 */
exports.viewStoreStockCardBatch = async (req, res) => {
    try {
        const storeStockCardBatchData = await sequelize.query(`
            SELECT 
                v.DrugCode,
                v.BatchNo,
                m.GenericName,
                m.BrandName,
                m.Dosage,
                m.Formulation,
                m.Unit,
                m.UnitSellingPrice,
                v.CurrentQuantity,
                (CASE WHEN v.CurrentQuantity > 0 THEN 'available'
                      ELSE 'stock out'
                 END) AS status,
                v.expirydate
            FROM vwStoreStockcardByBatch v
            INNER JOIN Medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            ORDER BY v.CurrentQuantity, v.DrugCode;
        `, {
            type: QueryTypes.SELECT,
        });

        if (!storeStockCardBatchData.length) {
            return res.status(404).json({ error: 'No store stock card batch data found' });
        }

        res.json(storeStockCardBatchData);
    } catch (error) {
        console.error('Error fetching store stock card batch data:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.viewStoreStockCardBatchByCode = async (req, res) => {
    const { drugCode } = req.params; // Assuming `drugCode` is passed as a URL parameter

    try {
        const storeStockCardBatchData = await sequelize.query(`
            SELECT 
                v.DrugCode,
                v.BatchNo,
                m.GenericName,
                m.BrandName,
                m.Dosage,
                m.Formulation,
                m.Unit,
                m.UnitSellingPrice,
                v.CurrentQuantity,
                v.ExpiryDate
            FROM vwStoreStockcardByBatch v
            INNER JOIN Medicine m
            ON v.DrugCode = m.DrugCode
            WHERE m.DrugStatus = 'active'
            AND v.DrugCode = :drugCode
            AND v.CurrentQuantity > 0
            ORDER BY v.CurrentQuantity;
        `, {
            type: QueryTypes.SELECT,
            replacements: { drugCode },
        });

        if (!storeStockCardBatchData.length) {
            return res.status(404).json({ error: 'No store stock card batch data found for the specified drug code' });
        }

        res.json(storeStockCardBatchData);
    } catch (error) {
        console.error('Error fetching store stock card batch data:', error);
        res.status(500).send('Internal Server Error');
    }
};






















