const UserRole = require('../models/userrole.js');
const UserAccount = require('../models/useraccount.js');
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