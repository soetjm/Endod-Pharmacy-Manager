'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      //create views

    await queryInterface.sequelize.query(`
      CREATE VIEW public.vwpharmacydispensary AS
      SELECT dispensary.drugcode,
         dispensary.batchno,
             CASE
                 WHEN ((dispensary.issuestatus)::text = 'returned'::text) THEN (dispensary.quantity * '-1'::integer)
                 ELSE dispensary.quantity
             END AS initialquantity,
         dispensary.expirydate,
         dispensary.issueddate AS recorddate,
         dispensary.batchstatus,
         ('D'::text || dispensary.stockrequestno) AS requestno
        FROM public.dispensary
      UNION ALL
       SELECT disposablemedicine.drugcode,
          disposablemedicine.batchno,
          (disposablemedicine.quantity * '-1'::integer) AS initialquantity,
          NULL::date AS expirydate,
          disposablemedicine.damagedate AS recorddate,
          disposablemedicine.damagestatus AS batchstatus,
          ('R'::text || disposablemedicine.did) AS requestno
         FROM public.disposablemedicine
        WHERE (((disposablemedicine.damagedfrom)::text = 'dispensary'::text) AND ((disposablemedicine.damagestatus)::text <> 'rejected'::text))
      UNION ALL
       SELECT sales.drugcode,
          NULL::character varying AS batchno,
          (sales.quantity * '-1'::integer) AS initialquantity,
          NULL::date AS expirydate,
          sales.salesdate AS recorddate,
          sales.salesstatus AS batchstatus,
          ('S'::text || sales.salesid) AS requestno
         FROM public.sales
        WHERE ((sales.salesstatus)::text = 'sold'::text);
        
    `);

    await queryInterface.sequelize.query(`
      CREATE VIEW public.vwdispensarystockcard AS
        SELECT vwpharmacydispensary.drugcode,
           sum(vwpharmacydispensary.initialquantity) AS currentquantity
          FROM public.vwpharmacydispensary
         WHERE (((vwpharmacydispensary.batchstatus)::text <> 'expired'::text) AND ((vwpharmacydispensary.batchstatus)::text <> 'removed'::text))
         GROUP BY vwpharmacydispensary.drugcode;
    `);

    await queryInterface.sequelize.query(`
      CREATE VIEW public.vwpharmacystorein AS
        SELECT purchaselog.drugcode,
           purchaselog.batchno,
           purchaselog.quantity AS initialquantity,
           purchaselog.unitcost,
           purchaselog.expirydate,
           purchaselog.purchasedate AS recorddate,
           purchaselog.batchstatus,
           ('P'::text || purchaselog.purchaserequestno) AS requestno
          FROM public.purchaselog
         WHERE ((purchaselog.batchstatus)::text <> 'removed'::text)
      UNION ALL
       SELECT transferlog.drugcode,
          transferlog.batchno,
          transferlog.quantity AS initialquantity,
          transferlog.unitcost,
          transferlog.expirydate,
          transferlog.transferdate AS recorddate,
          transferlog.batchstatus,
          ('T'::text || transferlog.transferrequestno) AS requestno
         FROM public.transferlog
        WHERE ((transferlog.batchstatus)::text <> 'removed'::text);
    `);

    await queryInterface.sequelize.query(`
      CREATE VIEW public.vwpharmacystore AS
        SELECT purchaselog.drugcode,
           purchaselog.batchno,
           purchaselog.quantity AS initialquantity,
           purchaselog.expirydate,
           purchaselog.purchasedate AS recorddate,
           purchaselog.batchstatus,
           ('P'::text || purchaselog.purchaserequestno) AS requestno
          FROM public.purchaselog
      UNION ALL
       SELECT transferlog.drugcode,
          transferlog.batchno,
              CASE
                  WHEN ((transferlog.batchstatus)::text = 'transferred out'::text) THEN (transferlog.quantity * '-1'::integer)
                  ELSE transferlog.quantity
              END AS initialquantity,
          transferlog.expirydate,
          transferlog.transferdate AS recorddate,
          transferlog.batchstatus,
          ('T'::text || transferlog.transferrequestno) AS requestno
         FROM public.transferlog
      UNION ALL
       SELECT dispensary.drugcode,
          dispensary.batchno,
              CASE
                  WHEN ((dispensary.issuestatus)::text = 'returned'::text) THEN dispensary.quantity
                  ELSE (dispensary.quantity * '-1'::integer)
              END AS initialquantity,
          dispensary.expirydate,
          dispensary.issueddate AS recorddate,
          dispensary.batchstatus,
          ('D'::text || dispensary.stockrequestno) AS requestno
         FROM public.dispensary
      UNION ALL
       SELECT r.drugcode,
          r.batchno,
          (r.quantity * '-1'::integer) AS initialquantity,
          ( SELECT DISTINCT v.expirydate
                 FROM public.vwpharmacystorein v
                WHERE (((v.drugcode)::text = (r.drugcode)::text) AND ((v.batchno)::text = (r.batchno)::text))) AS expirydate,
          r.damagedate AS recorddate,
          r.damagestatus AS batchstatus,
          ('R'::text || r.did) AS requestno
         FROM public.disposablemedicine r
        WHERE (((r.damagedfrom)::text = 'store'::text) AND ((r.damagestatus)::text <> 'rejected'::text));
    `);

    await queryInterface.sequelize.query(`
        CREATE VIEW public.vwstorestockcardbycode AS
          SELECT vwpharmacystore.drugcode,
             sum(vwpharmacystore.initialquantity) AS currentquantity
            FROM public.vwpharmacystore
           WHERE (((vwpharmacystore.batchstatus)::text <> 'expired'::text) AND ((vwpharmacystore.batchstatus)::text <> 'removed'::text))
           GROUP BY vwpharmacystore.drugcode;
    `);

    await queryInterface.sequelize.query(`
      CREATE VIEW public.vwallpharmacydrugs AS
        SELECT vs.drugcode,
           COALESCE(vs.currentquantity, (0)::bigint) AS storequantity,
           COALESCE(vd.currentquantity, (0)::bigint) AS dispensaryquantity,
               CASE
                   WHEN (vs.drugcode IS NULL) THEN vd.currentquantity
                   WHEN (vd.drugcode IS NULL) THEN vs.currentquantity
                   ELSE (vs.currentquantity + vd.currentquantity)
               END AS totalquantity
          FROM (public.vwstorestockcardbycode vs
            LEFT JOIN public.vwdispensarystockcard vd ON (((vs.drugcode)::text = (vd.drugcode)::text)))
         WHERE (vs.drugcode IS NOT NULL);
    `);

    await queryInterface.sequelize.query(`
      CREATE VIEW public.vwminmaxmedicinecost AS
        SELECT vwpharmacystorein.drugcode,
           min(vwpharmacystorein.unitcost) AS mincost,
           max(vwpharmacystorein.unitcost) AS maxcost
          FROM public.vwpharmacystorein
         GROUP BY vwpharmacystorein.drugcode;
    `);

    await queryInterface.sequelize.query(`
      CREATE VIEW public.vwstorestockcardbybatch AS
        SELECT vwpharmacystore.drugcode,
           vwpharmacystore.batchno,
           vwpharmacystore.expirydate,
           sum(vwpharmacystore.initialquantity) AS currentquantity
          FROM public.vwpharmacystore
         WHERE (((vwpharmacystore.batchstatus)::text <> 'expired'::text) AND ((vwpharmacystore.batchstatus)::text <> 'removed'::text))
         GROUP BY vwpharmacystore.drugcode, vwpharmacystore.batchno, vwpharmacystore.expirydate;
    `);

    await queryInterface.sequelize.query(`
        CREATE VIEW public.vwtransferebalestock AS
          SELECT vwpharmacystore.drugcode,
             sum(vwpharmacystore.initialquantity) AS currentquantity
            FROM public.vwpharmacystore
           WHERE (((vwpharmacystore.batchstatus)::text <> 'expired'::text) AND ((vwpharmacystore.batchstatus)::text <> 'removed'::text))
           GROUP BY vwpharmacystore.drugcode;  
    `);

    await queryInterface.sequelize.query(`
        CREATE VIEW public.vwuseremployeerole AS
          SELECT e.username,
             (((e.firstname)::text || ' '::text) || (e.lastname)::text) AS fullname,
             u.accountstatus,
             r.role,
             r.rolestatus
            FROM ((public.employee e
              JOIN public.useraccount u ON (((e.username)::text = (u.username)::text)))
              JOIN public.userrole r ON (((e.username)::text = (r.username)::text)));
    `);
  },

  async down (queryInterface, Sequelize) {
    //removing if the views is exist

    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vwpharmacydispensary;`);

    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vwdispensarystockcard`);

    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vwpharmacystorein`);
    
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vwpharmacystore`);
    
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vwstorestockcardbycode`);
    
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vwallpharmacydrugs`);
    
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vwminmaxmedicinecost`);
    
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vwstorestockcardbybatch`);
    
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vwtransferebalestock`);
    
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vwuseremployeerole`);
  }
};
