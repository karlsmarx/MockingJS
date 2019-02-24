const generator = require("./generator.js");

/* eslint-disable*/
const sqlStatement = "CREATE TABLE IF NOT EXISTS `mydb`.`table1` ( \n\
	`idtable1` INT NOT NULL,\n\
	`decimal` DECIMAL(66,31) NULL,\n\
	`decimal2` DECIMAL NULL,\n\
	`dec` DEC NULL,\n\
	`numeric` NUMERIC NULL,\n\
	`fixed` FIXED NULL,\n\
	PRIMARY KEY (`idtable1`))\n\
  ENGINE = InnoDB;";

console.log(generator.parse(sqlStatement));
