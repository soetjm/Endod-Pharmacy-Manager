const { Sequelize } = require('sequelize');
const  UserLog  = require('../models/userlog.js');
const  UserAccount  = require('../models/useraccount.js');
exports.listUserLogs = async (req, res) => {
    try {
        const userLogs = await UserLog.findAll({
            attributes: [
                ['username', 'username'],
                ['operationtype', 'operationtype'],
                ['operationtime', 'operationtime']
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
            order: [['operationtime', 'ASC']],
            raw: true
        });

        res.json(userLogs);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};