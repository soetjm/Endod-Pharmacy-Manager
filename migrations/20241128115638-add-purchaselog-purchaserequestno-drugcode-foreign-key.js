'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('booklog', {
      fields: ['gender'],
      type: 'check',
      where: {
        gender: ['male', 'female'],
      },
      name: 'booklog_gender_check',
    });

    await queryInterface.addConstraint('sales',{
      fields:['drugcode'],
      type:'foreign key',
      name:'sales_drugcode_fkey',
      references:{
        table:'medicine',
        field:'drugcode',
      },
      onDelete:'CASCADE',
      onUpdate:'CASCADE',
    })

    await queryInterface.addConstraint('disposablemedicine', {
      fields: ['drugcode'], // Local column
      type: 'foreign key',
      name: 'disposablemedicine_drugcode_fkey', // Constraint name
      references: {
        table: 'medicine', // Referenced table
        field: 'drugcode', // Referenced column
      },
      onDelete: 'CASCADE', // Optional: Action on delete
      onUpdate: 'CASCADE', // Optional: Action on update
    });

    await queryInterface.addConstraint('booklog', {
      fields: ['prescriptiontype'],
      type: 'check',
      where: {
        prescriptiontype: ['narcotic', 'psychotropic', 'other'],
      },
      name: 'booklog_prescriptiontype_check',
    });

    await queryInterface.addConstraint('employee', {
      fields: ['username'], // Column in employee table
      type: 'foreign key',
      name: 'employee_username_fkey', // Constraint name
      references: {
        table: 'useraccount', // Referenced table
        field: 'username',    // Referenced column
      },
      onDelete: 'CASCADE',    // Optional: Action on delete
      onUpdate: 'CASCADE',    // Optional: Action on update
    });

    await queryInterface.addConstraint('stockrequest', {
      fields: ['drugcode'], // Column in stockrequest
      type: 'foreign key',
      name: 'stockrequest_drugcode_fkey', // Constraint name
      references: {
        table: 'medicine', // Referenced table
        field: 'drugcode', // Referenced column
      },
      onDelete: 'CASCADE',    // Optional: Action on delete
      onUpdate: 'CASCADE',    // Optional: Action on update
    });

    await queryInterface.addConstraint('transferrequest',{
      fields:['drugcode'],
      type:'foreign key',
      name:'transferrequest_drugcode_fkey',
      references:{
        table:'medicine',
        field:'drugcode',
      },
      onDelete:'CASCADE',
      onUpdate:'CASCADE',
    })

    await queryInterface.addConstraint('userrole',{
      fields:['username'],
      type:'foreign key',
      name:'userrole_username_fkey',
      references:{
        table:'useraccount',
        field:'username',
      },
      onDelete:'CASCADE',
      onUpdate:'CASCADE',
    })

    await queryInterface.addConstraint('userlog',{
      fields:['username'],
      type:'foreign key',
      name:'userlog_username_fkey',
      references:{
        table:'useraccount',
        field:'username',
      },
      onDelete:'CASCADE',
      onUpdate:'CASCADE',
    })

    await queryInterface.addConstraint('purchaserequest',{
      fields:['drugcode'],
      type:'foreign key',
      name:'purchaserequest_drugcode_fkey',
      references:{
        table:'medicine',
        field:'drugcode',
      },
      onDelete:'CASCADE',
      onUpdate:'CASCADE',
    })
    
    await queryInterface.addConstraint('purchaserequest', {
      fields: ['purchaserid', 'drugcode'],  // The combination of these fields
      type: 'unique',
      name: 'unique_purchaserid_drugcode'   // Constraint name
    });
    await queryInterface.sequelize.query(`
      ALTER TABLE ONLY public.booklog
      ADD CONSTRAINT booklog_salesid_drugcode_fkey 
      FOREIGN KEY (salesid, drugcode) 
      REFERENCES public.sales(salesid, drugcode)
      ON DELETE CASCADE
      ON UPDATE CASCADE
      `)
    await queryInterface.sequelize.query(`
      ALTER TABLE public.purchaselog
      ADD CONSTRAINT purchaselog_purchaserequestno_drugcode_fkey
      FOREIGN KEY (purchaserequestno, drugcode)
      REFERENCES public.purchaserequest(purchaserid, drugcode)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE ONLY public.dispensary
      ADD CONSTRAINT dispensary_drugcode_stockrequestno_fkey 
      FOREIGN KEY (drugcode, stockrequestno) 
      REFERENCES public.stockrequest(drugcode, stockrid)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `)
    await queryInterface.sequelize.query(`
      ALTER TABLE ONLY public.transferlog
      ADD CONSTRAINT transferlog_transferrequestno_drugcode_purchasedate_fkey 
      FOREIGN KEY (transferrequestno, drugcode, purchasedate) 
      REFERENCES public.transferrequest(transferrid, drugcode, purchasedate)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('booklog','booklog_prescriptiontype_check');
    await queryInterface.removeConstraint('booklog','booklog_gender_check');

    await queryInterface.removeConstraint(
      'disposablemedicine',
      'disposablemedicine_drugcode_fkey'
    );

    await queryInterface.removeConstraint('purchaserequest','purchaserequest_drugcode_fkey');
    await queryInterface.removeConstraint('stockrequest', 'stockrequest_drugcode_fkey');
    await queryInterface.removeConstraint('transferrequest','transferrequest_drugcode_fkey');
    await queryInterface.removeConstraint('sales','sales_drugcode_fkey');
    await queryInterface.removeConstraint('employee', 'employee_username_fkey');
    await queryInterface.removeConstraint('userlog','userlog_username_fkey');
    await queryInterface.removeConstraint('userrole','userrole_username_fkey');

    await queryInterface.sequelize.query(`
      ALTER TABLE public.purchaselog
      DROP CONSTRAINT purchaselog_purchaserequestno_drugcode_fkey;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE public.booklog
      DROP CONSTRAINT booklog_salesid_drugcode_fkey;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE public.dispensary
      DROP CONSTRAINT dispensary_drugcode_stockrequestno_fkey;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE public.transferlog
      DROP CONSTRAINT transferlog_transferrequestno_drugcode_purchasedate_fkey;
    `);
    
    await queryInterface.removeConstraint('purchaserequest', 'unique_purchaserid_drugcode');
  }
};
