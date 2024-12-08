const Sequelize = require('sequelize');
const Employee = require('../models/employee.js');
const UserAccount = require('../models/useraccount.js');

exports.ViewEmployeeName=async (req,res)=>{
    const username=req.params.username;
    console.log(username,'username from the parameter')
    const employe =await Employee.findOne({where:{username:username}});
    if(employe === null){
        console.log('there is no user data');
    }else{
        console.log(`${employe.firstname} ${employe.lastname}`);
    }
}

exports.createEmployee = async (req, res) => {
    const { username, firstname, lastname, dob, subcity, woreda, houseno, phonenumber, email } = req.body;
    const userExist = await UserAccount.findOne({
        where:{username:username},
    });
    if(userExist != null){
        const currentTime = new Date();
        Employee.create({
            eid:'1',
            username:username,
            firstname:firstname,
            lastname:lastname,
            dob:dob,
            subcity:subcity,
            woreda:woreda,
            houseno:houseno,
            phonenumber:phonenumber,
            email:email
        }).then(result=>{
            console.log('created successfully');
            res.json({message:'created successfully'});
        }).catch(err=>{
            res.json({message:'failed to create'});
            console.log(err);
        })

    }else{
        console.log('user is not exist');
        res.json({message:'user is not already exist'});
    }
}


exports.listActiveemployees = async (req, res) => {
    try {
        const activeEmployees = await Employee.findAll({
            attributes: [
                'username',
                'firstname',
                'lastname',
                [Sequelize.literal('"Employee"."firstname" || \' \' || "Employee"."lastname"'), 'FullName']
            ],
            include: [
                {
                    model: UserAccount,
                    as: 'UserAccount',
                    attributes: [],
                    where: {
                        accountstatus: 'active'
                    }
                }
            ]
        });

        res.json(activeEmployees.map(e => e.dataValues));
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
};