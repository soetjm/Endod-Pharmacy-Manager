const UserRole = require('../models/userrole.js');
const UserAccount = require('../models/useraccount.js');
const Employee = require('../models/employee.js');
const Sequelize = require('sequelize');
const argon2 = require('argon2');


exports.addRole = async(req,res)=>{
    const role = req.body.role;
    const username = req.body.username;

    const existingRole = await UserRole.findOne({
        where: {
          username: username,
          role: role,
        },
    });

    const existUserAccount = await UserAccount.findOne({
        where:{
            username:username,
        }
    })

    if(existUserAccount == null){
        console.log('the user must be first register in the useraccount');
        return;
    }

    if(existingRole == null){
        UserRole.create({
            username:username,
            role:role
        }).then(result=>{
            console.log(true,'create userrole successfully');
        }).catch(err=>{
            console.error(err,'error occured when we try to add userrole');
        })
    }else{
        console.log(false,' there is exist userrole');
    }

}

exports.canLogin = async (req, res) => {
    const { username, passwd, role } = req.body;
    try {
        const canLogin = await UserAccount.findOne({
            attributes: ['username'],
            include: [
                {
                    model: UserRole,
                    as: 'UserRoles',
                    attributes: ['role'],
                    where: {
                        rolestatus: 'active',
                        role: role
                    },
                },
            ],
            where: {
                username: username,
            }
        });
        const useAcc = await UserAccount.findOne({where:{username:username}});
        const userHashPassword =  useAcc.dataValues.password;
        let indecator = false;

        if(await argon2.verify(userHashPassword,passwd)){
            indecator = true;
        }

        if (canLogin && indecator) {
            res.json({ canLogin: true });
        } else {
            res.json({ canLogin: false });
        }
    } catch (error) {
        console.error('Error validating login:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listUserroles = async (req, res) => {
    try {
        const userRoles = await UserRole.findAll({
            attributes: [
                ['username', 'username'],
                ['role', 'role'],
                ['rolestatus', 'rolestatus'],
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
            order: [['role', 'ASC']],
            raw: true
        });

        const userEmployee = await Employee.findAll({
            attributes: [
                ['username','username'],
                [
                Sequelize.literal(`"Employee"."firstname" || ' ' || "Employee"."lastname"`),
                'fullname'
               ]
            ],
        })
        let employeArray = [];
        userEmployee.forEach(element => {
            employeArray.push(element.dataValues);
        })
        const arrayResult = userRoles.map(itemOne => ({
            ...itemOne,
            ...employeArray.find(itemTwo => itemTwo.username === itemOne.username)
        }));
        
        res.json(arrayResult);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


exports.selectUserrole = async (req, res) => {
    const { username } = req.body;

    try {
        const userRoles = await UserRole.findAll({
            attributes: [
                'username',
                'role',
                'rolestatus'
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
                username
            },
            order: [['role', 'ASC']],
            raw: true
        });

        res.json(userRoles);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
