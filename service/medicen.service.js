const Medicine = require('../models/medicine.js');


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