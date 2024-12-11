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

exports.selectActivepharmacy = async (req, res) => {
    const { pharmacyname, branchname } = req.body;
    if(!pharmacyname || !branchname){
        res.json({message:'empty pharma name or brance name'});
        return;
    }
    try {
        const pharmacy = await Pharmaciy.findAll({
            attributes: [
                ['pharmacyname', 'pharmacyname'],
                ['branchname', 'branchname'],
                ['subcity', 'subcity'],
                ['woreda', 'woreda'],
                ['houseno', 'houseno'],
                ['phonenumber', 'phonenumber'],
                ['email', 'email']
            ],
            where: {
                pharmacystatus: 'active',
                pharmacyname: pharmacyname,
                branchname: branchname
            },
            raw: true
        });

        res.json(pharmacy);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.selectCurrentpharmacy = async (req, res) => {
    const { pharmacyname, branchname } = req.body;

    try {
        const pharmacy = await Pharmaciy.findAll({
            attributes: [
                ['pharmacyname', 'pharmacyname'],
                ['branchname', 'branchname'],
                ['subcity', 'subcity'],
                ['woreda', 'woreda'],
                ['houseno', 'houseno'],
                ['phonenumber', 'phonenumber'],
                ['email', 'email']
            ],
            where: {
                pharmacystatus: 'active',
                pharmacyname: pharmacyname,
                branchname: branchname
            },
            raw: true
        });

        res.json(pharmacy);
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
};