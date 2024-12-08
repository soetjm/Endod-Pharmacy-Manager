const UserAccount = require('../models/useraccount.js');
const UserRole = require('../models/userrole.js');
const Sequelize = require('sequelize');
const argon2 = require('argon2');

/**
 * 
 * @Important the incription type is argon2  
 * @param {*} res 
 */
exports.changePassword=async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    try {
        const user = await UserAccount.findOne({
            where: {
                username: username,
                password: oldPassword,
            }
        });

        if (user) {
            await user.update({
                Password: UserAccount.sequelize.fn('crypt', newPassword, UserAccount.sequelize.fn('gen_salt', 'md5')),
                DateModified: UserAccount.sequelize.fn('localtimestamp', 0)
            });

            console.log('Password updated successfully');
            res.json({ success: true });
        } else {
            console.log('Invalid username or password');
            res.status(400).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.checkAccountrole=async (req,res)=>{
    const { username,password,role } = req.body;
    const userAccount = await UserAccount.findOne({where:{username:username}});
    if(userAccount){
        const dataValues = userAccount.dataValues;
        if(password == dataValues.password && dataValues.accountstatus != 'deleted'){
            if(dataValues.accountstatus=='active'){
                const userRole = await UserRole.findOne({where:{username:username}});
                const userRoleDataVale = userRole.dataValues;
                if(role == userRoleDataVale.role){
                    if(userRoleDataVale.rolestatus == 'active'){
                        console.log(1);
                        return 1
                    }else{
                        console.log(-4);
                        return(-4);
                    }
                }else{
                    console.log(-3)
                    return(-3)
                }
             }else{
                console.log(-2)
                return -2
             }
        }else{
            console.log(-1)
            return -1
        }
    }else{
        console.log('there is no data')
    }
}


exports.createAccount = async (req, res) => {
    const { username, password} = req.body;

    try{
        const hashPassword = await argon2.hash(password);
        const existUser = await UserAccount.findOne({where:{username:username}});
        if(existUser == null){
            const currentTimestamp = new Date();
            const localTimestamp = new Date(currentTimestamp.toLocaleString());
            UserAccount.create(
                {
                    username:username,
                    password:hashPassword,
                    datecreated:localTimestamp,
                    datemodified:localTimestamp
                }).then(result=>{
                    console.log('created succesfuly');
                    res.json({message:'created succesfuly'});
                }).catch(err=>{
                    console.error(err,'error occured when we try to add useraccount ');
                });
        
        }else{
            console.log('user alrady exist');
            res.json({message:'user alrady exist'});
        }
       
    }catch(err){
        console.error('error occured when we try to hash password');
    }
    

}

exports.forgetPassword = async (req, res) => {
    const { username, newPassword } = req.body;

    try {
        const userExists = await UserAccount.findOne({
            where: { username: username },
        });

        if (!userExists) {
            console.log(`User with username ${username} does not exist.`);
            res.status(404).json({ success: false, message: 'User not found' });
            console.log(false);
        }else{
            const hashedPassword = await argon2.hash(newPassword);
            console.log(newPassword);
            const currentTimestamp = new Date();
            const localTimestamp = new Date(currentTimestamp.toLocaleString());
            const updateResult = await UserAccount.update(
                {
                    password: hashedPassword,
                    datemodified: localTimestamp,
                },
                {
                    where: { username: username },
                }
            );
    
            if (updateResult[0] > 0) {
                console.log('Password updated successfully.');
                res.json({ success: true, message: 'Password updated successfully' });
                console.log(true)
            } else {
                console.log('Failed to update password.');
                res.status(500).json({ success: false, message: 'Failed to update password' });
            }
        }
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.listActiveusernames = async (req, res) => {
    try {
        const activeUsernames = await UserAccount.findAll({
            attributes: ['username'],
            where: {
                accountstatus: 'active',
            },
        });

        const usernamesArray = activeUsernames.map((user) => user.username);
        if (activeUsernames.length > 0) {
            console.log('Fetched active usernames successfully:', usernamesArray);
            res.json(usernamesArray); 
        } else {
            console.log('No active usernames found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching active usernames:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listAllusernames = async (req, res) => {
    try {
        const userAccounts = await UserAccount.findAll({
            attributes: ['username', 'accountstatus'],
            where: {
                accountstatus: {
                    [Sequelize.Op.ne]: 'deleted' 
                }
            }
        });

        const usernamesArray = userAccounts.map((user) => user.dataValues);

        if (userAccounts.length > 0) {
            console.log('Fetched active usernames successfully:', usernamesArray);
            res.json(usernamesArray); 
        } else {
            console.log('No active usernames found.');
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching usernames:', error);
        res.status(500).send('Internal Server Error');
    }
};



