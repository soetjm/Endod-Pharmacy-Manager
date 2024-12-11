const Supplier = require('../models/supplier.js');


exports.listActivesuppliers =async (req, res) => {
    try {
        const activeSuppliers = await Supplier.findAll({
            attributes: [
                'suppliername',
                'subcity',
                'woreda',
                'houseno',
                'phonenumber',
                'email',
            ],
            where: {
                supplierstatus: 'active',
            },
        });
        const suppliersArray = activeSuppliers.map((supplier) => supplier.dataValues);
        if (activeSuppliers.length > 0) {
            console.log('Fetched active suppliers successfully:', suppliersArray);
            res.json(suppliersArray); 
        } else {
            console.log('No active suppliers found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching active suppliers:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.selectActivesupplier = async (req, res) => {
    const { suppliername } = req.body;
    if(!suppliername){
        res.json({message:'empity suppliername'});
    }

    try {
        const supplier = await Supplier.findAll({
            attributes: [
                ['suppliername', 'suppliername'],
                ['subcity', 'subcity'],
                ['woreda', 'woreda'],
                ['houseno', 'houseno'],
                ['phonenumber', 'phonenumber'],
                ['email', 'email']
            ],
            where: {
                supplierstatus: 'active',
                suppliername: suppliername
            },
            raw: true
        });

        res.json(supplier);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}; 