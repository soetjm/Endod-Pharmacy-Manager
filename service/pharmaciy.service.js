const Pharmaciy = require('../models/pharmacy.js');

exports.listactivePharmacies = async (req, res) => {
    try {
        const activePharmacies = await Pharmaciy.findAll({
            attributes: [
                'pharmacyname',
                'branchname',
                'subcity',
                'woreda',
                'houseno',
                'phonenumber',
                'email',
            ],
            where: {
                pharmacystatus: 'active',
            },
        });
        const pharmaciesArray = activePharmacies.map((pharmacy) => pharmacy.dataValues);

        if (activePharmacies.length > 0) {
            console.log('Fetched active pharmacies successfully:', pharmaciesArray);
            res.json(pharmaciesArray); 
        } else {
            console.log('No active pharmacies found.');
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching active pharmacies:', error);
        res.status(500).send('Internal Server Error');
    }
};