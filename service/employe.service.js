const Sequelize = require('sequelize');
const Employee = require('../models/employee.js');
const UserAccount = require('../models/useraccount.js');
const UserRole = require('../models/userrole.js');

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


exports.listActiveemployeeswithroles = async (req, res) => {
    try {
        const activeEmployees = await Employee.findAll({
            attributes: [
                'username',
                [Sequelize.literal('"Employee"."firstname" || \' \' || "Employee"."lastname"'), 'FullName'],
                'dob',
                'subcity',
                'woreda',
                'houseno',
                'phonenumber',
                'email'
            ],
            include: [
                {
                    model: UserAccount,
                    as: 'UserAccount',
                    attributes: [],
                    required: true,
                    where: {
                        accountstatus: 'active'
                    }
                },
                // {
                //     model: UserRole,
                //     as: 'UserRole',
                //     attributes: ['role'],
                //     where: {
                //         rolestatus: 'active'
                //     }
                // }
            ]
        });

        const userRole = await UserRole.findAll({
            attributes: [
                'username',
                'role'
            ],
            include: [
                {
                    model: UserAccount,
                    as: 'UserAccount',
                    attributes: [],
                    required: true,
                    where: {
                        accountstatus: 'active'
                    }
                }
            ]
        });
        const rolesArray = userRole.map((data) => data.dataValues);

        const employeeArray = activeEmployees.map((data) => data.dataValues);

        const userDetailsMap = employeeArray.reduce((map, detail) => {
            map[detail.username] = detail;
            return map;
        }, {});

        const result = rolesArray.map(roleObj => {
            const userDetails = userDetailsMap[roleObj.username];
            return {
              username:roleObj.username,
              fullname:userDetails.FullName,
              dob:userDetails.dob,
              subcity:userDetails.subcity,
              woreda:userDetails.woreda,
              houseno:userDetails.houseno,
              phonenumber:userDetails.phonenumber,
              email:userDetails.email,
              role:roleObj.role,
            };
        });
          
        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listAllemployees = async (req, res) => {
    try {
        const allEmployees = await Employee.findAll({
            attributes: [
                'username',
                'firstname',
                'lastname',
                [Sequelize.literal('"Employee"."firstname" || \' \' || "Employee"."lastname"'), 'FullName'],
                'dob',
                'subcity',
                'woreda',
                'houseno',
                'phonenumber',
                'email'
            ],
            include: [
                {
                    model: UserAccount,
                    attributes: ['accountstatus'],
                    required: true,
                    where: {
                        accountstatus: {
                            [Sequelize.Op.ne]: 'deleted'
                        }
                    }
                }
            ]
        });

        const result = allEmployees.map(employee => ({
            ...employee.dataValues,
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.selectEmployeeInfo = async (req, res) => {
    const { username } = req.body;

    try {
        const employeeInfo = await Employee.findAll({
            attributes: [
                ['username', 'username'],
                ['firstname', 'firstname'],
                ['lastname', 'lastname'],
                [Sequelize.literal('"Employee"."firstname" || \' \' || "Employee"."lastname"'), 'fullname'],
                ['dob', 'dob'],
                ['subcity', 'subcity'],
                ['woreda', 'woreda'],
                ['houseno', 'houseno'],
                ['phonenumber', 'phonenumber'],
                ['email', 'email'],
                [Sequelize.col('UserAccount.accountstatus'), 'accountstatus']
            ],
            include: [
                {
                    model: UserAccount,
                    attributes: [],
                    where: {
                        accountstatus: {
                            [Sequelize.Op.ne]: 'deleted'
                        }
                    }
                }
            ],
            where: {
                username: username
            },
            raw: true
        });

        res.json(employeeInfo);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};


/**
 * @important fnviewemployeename is the same ViewEmployeeName
 */