'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fnaddmedicine(i_drugcode character varying, i_genericname character varying, i_brandname character varying, i_dosage character varying, i_formulation character varying, i_classification character varying, i_unit character varying, i_unitsellingprice numeric) RETURNS integer
        LANGUAGE plpgsql
        AS $$
      begin
      	if not exists (select m.DrugCode from Medicine m where m.DrugCode = i_DrugCode) then
      		if not exists (select m.DrugCode from Medicine m where m.GenericName = i_GenericName and m.BrandName = i_BrandName and m.Dosage = i_Dosage and m.Formulation = i_Formulation and m.Unit = i_Unit) then							   
      			insert into Medicine(DrugCode, GenericName, BrandName, Dosage, Formulation, Classification, Unit, UnitSellingPrice)	
      			values(i_DrugCode, i_GenericName, i_BrandName, i_Dosage, i_Formulation, i_Classification, i_Unit, nullif(i_UnitSellingPrice, 0));
      			return 1;				   
      		else
      			--this medicine is already registered				   
      			return -2;
      		end if;					   
      	else
      		--drug code already available					   
      		return -1;
      	end if;
      end;$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fnaddrole(i_username character varying, i_role character varying) RETURNS boolean
        LANGUAGE plpgsql
        AS $$
      begin
      	if not exists (select r.UserName from UserRole as r where r.UserName = i_UserName and r.Role = i_Role) then
      		insert into UserRole(UserName, Role) values(i_UserName, i_Role);
      		return true;
      	else
      		return false;
      	end if;
      end;$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fnallrevenuebydate() RETURNS TABLE(salesdate date, totalsold bigint, totalrevenue numeric)
        LANGUAGE plpgsql
        AS $$
      begin
      	return query						   
      	select s.SalesDate, sum(s.Quantity) as TQuantiy, sum(s.Quantity * s.UnitSellingPrice) as TPrice
      	from Sales s
      	where s.SalesStatus = 'sold'						   
      	group by s.SalesDate
      	order by  s.SalesDate desc;						   
      end;$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fnallrevenuebymonth() RETURNS TABLE(salesmonth double precision, salesyear double precision, totalsold bigint, totalrevenue numeric)
        LANGUAGE plpgsql
        AS $$
      begin
      	return query						   
      	select extract(month from s.SalesDate)::double precision, extract(year from s.SalesDate)::double precision, sum(s.Quantity) as TQuantiy, sum(s.Quantity * s.UnitSellingPrice) as TPrice
      	from Sales s
      	where s.SalesStatus = 'sold'						   
      	group by extract(year from s.SalesDate), extract(month from s.SalesDate)  
      	order by extract(year from s.SalesDate) desc, extract(month from s.SalesDate); 						   
      end;$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fnallrevenuebymonthyear(i_year integer, i_month integer) RETURNS TABLE(salesmonth double precision, salesyear double precision, totalsold bigint, totalrevenue numeric)
        LANGUAGE plpgsql
        AS $$
      begin
      	return query						   
      	select extract(month from s.SalesDate)::double precision, extract(year from s.SalesDate)::double precision, sum(s.Quantity) as TQuantiy, sum(s.Quantity * s.UnitSellingPrice) as TPrice
      	from Sales s
      	where s.SalesStatus = 'sold' and extract(year from s.SalesDate) = i_Year and extract(month  from s.SalesDate) = i_Month					   
      	group by extract(year from s.SalesDate), extract(month from s.SalesDate)  
      	order by extract(year from s.SalesDate) desc, extract(month from s.SalesDate); 						   
      end;$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fnallrevenuebyyear(i_year integer) RETURNS TABLE(salesmonth double precision, salesyear double precision, totalsold bigint, totalrevenue numeric)
        LANGUAGE plpgsql
        AS $$
      begin
      	return query						   
      	select extract(month from s.SalesDate)::double precision, extract(year from s.SalesDate)::double precision, sum(s.Quantity) as TQuantiy, sum(s.Quantity * s.UnitSellingPrice) as TPrice
      	from Sales s
      	where s.SalesStatus = 'sold' and extract(year from s.SalesDate) = i_Year 					   
      	group by extract(year from s.SalesDate), extract(month from s.SalesDate)  
      	order by extract(year from s.SalesDate) desc, extract(month from s.SalesDate); 						   
      end;$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fnallsoldbydatecode() RETURNS TABLE(salesdate date, drugcode character varying, genericname character varying, brandname character varying, dosage character varying, formulation character varying, totalsold bigint, totalrevenue numeric)
        LANGUAGE plpgsql
        AS $$
      begin
      	return query						   
      	select s.SalesDate, s.DrugCode, m.GenericName, m.BrandName, m.Dosage, m.Formulation, sum(s.Quantity) as TQuantiy, sum(s.Quantity * s.UnitSellingPrice) as TPrice
      	from Sales s
      	inner join Medicine m
      	on s.DrugCode = m.DrugCode 						   
      	where s.SalesStatus = 'sold' and m.DrugStatus = 'active'						   
      	group by s.SalesDate, s.DrugCode, m.GenericName, m.BrandName, m.Dosage, m.Formulation
      	order by  s.SalesDate desc, s.DrugCode; 						   
      end;$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fnallsoldbymonthcode() RETURNS TABLE(salesmonth double precision, salesyear double precision, drugcode character varying, genericname character varying, brandname character varying, dosage character varying, formulation character varying, totalsold bigint, totalrevenue numeric)
        LANGUAGE plpgsql
        AS $$
      begin
      	return query						   
      	select extract(month from s.SalesDate)::double precision, extract(year from s.SalesDate)::double precision, s.DrugCode, m.GenericName, m.BrandName, m.Dosage, m.Formulation, sum(s.Quantity) as TQuantiy, sum(s.Quantity * s.UnitSellingPrice) as TPrice
      	from Sales s
      	inner join Medicine m
      	on s.DrugCode = m.DrugCode 						   
      	where s.SalesStatus = 'sold' and m.DrugStatus = 'active'							   
      	group by extract(year from s.SalesDate), extract(month from s.SalesDate), s.DrugCode, m.GenericName, m.BrandName, m.Dosage, m.Formulation  
      	order by extract(year from s.SalesDate) desc, extract(month from s.SalesDate), s.DrugCode; 						   
      end;$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fncanlogin(i_username character varying, i_passwd character varying, i_role character varying) RETURNS boolean
        LANGUAGE plpgsql
        AS $$
      begin
      	if exists (select u.UserName , r.role from UserAccount u 
      	inner join UserRole r on u.UserName = r.UserName
      	where u.UserName = i_UserName and u.Password = crypt(i_Passwd, u.Password) and r.rolestatus = 'active' and r.role = i_Role   )  then
      		return true;
      	else
      		return false;
      	end if;
      end;$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fnchangepassword(i_username character varying, i_oldpasswd character varying, i_newpasswd character varying) RETURNS boolean
        LANGUAGE plpgsql
        AS $$
      begin
      	if exists (select u.UserName from UserAccount as u where u.UserName = i_UserName and u.Password = crypt(i_OldPasswd, u.Password)) then
      		update UserAccount
      		set Password = crypt(i_NewPasswd, gen_salt('md5')), DateModified = localtimestamp(0)
      		where UserName = i_UserName and Password = crypt(i_OldPasswd, Password);
      		return true;
      	else
      		return false;
      	end if;
      end;$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fncheckaccountrole(i_username character varying, i_password character varying, i_role character varying) RETURNS integer
        LANGUAGE plpgsql
        AS $$
      begin
      	if exists (select u.UserName from UserAccount as u where u.UserName = i_UserName and u.Password = crypt(i_Password, u.Password) and u.AccountStatus != 'deleted') then
      		if exists (select UserName from UserAccount where UserName = i_UserName and AccountStatus = 'active') then
      			if exists (select UserName from UserRole where UserName = i_UserName and Role = i_Role) then
      				if exists (select UserName from UserRole where UserName = i_UserName and Role = i_Role and RoleStatus = 'active') then 	   
      					return 1;
      				 else
      					return -4;
      				 end if;
      			else
      				return -3;
      			end if;				   
      		else
      		    return -2;
      		end if;
      	else
      		return -1;
      	end if;
      end;$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE FUNCTION public.fncheckdispensaryexpiry() RETURNS TABLE(drugcode character varying, batchno character varying, genericname character varying, brandname character varying, dosage character varying, formulation character varying, unit character varying, expirydate date, remaining text)
        LANGUAGE plpgsql
        AS $$
      begin
      	return query
      	select d.DrugCode, d.BatchNo, m.GenericName, m.BrandName, m.Dosage, m.Formulation, m.Unit, d.ExpiryDate, 
      	age(d.ExpiryDate, current_date)::text as RemainingTime
      	from Dispensary as d	
      	inner join Medicine m
      	on d.DrugCode = m.DrugCode 						   
      	where m.DrugStatus = 'active' and d.BatchStatus = 'active'
      	group by d.DrugCode, d.BatchNo, m.GenericName, m.BrandName, m.Dosage, m.Formulation, m.Unit, d.ExpiryDate
      	order by age(d.ExpiryDate, current_date);
      end;$$;
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fnaddmedicine(i_drugcode character varying, i_genericname character varying, i_brandname character varying, i_dosage character varying, i_formulation character varying, i_classification character varying, i_unit character varying, i_unitsellingprice numeric)`)
    
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fnaddrole(i_username character varying, i_role character varying)`);
    
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fnallrevenuebydate()`);
    
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fnallrevenuebymonth()`);
    
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fnallrevenuebymonthyear(i_year integer, i_month integer)`);
    
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fnallrevenuebyyear(i_year integer)`);
    
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fnallsoldbydatecode()`);
    
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fnallsoldbymonthcode()`);
    
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fncanlogin(i_username character varying, i_passwd character varying, i_role character varying)`);
    
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fnchangepassword(i_username character varying, i_oldpasswd character varying, i_newpasswd character varying)`);
   
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fncheckaccountrole(i_username character varying, i_password character varying, i_role character varying)`);
    
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS fncheckdispensaryexpiry()`);
    
  }
};
