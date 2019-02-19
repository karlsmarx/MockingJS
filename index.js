const generator = require("./generator.js");

/* eslint-disable*/
const sqlStatement = "CREATE TABLE IF NOT EXISTS `mydb`.`table1` ( \
	`idtable1` INT NOT NULL,\
	`decimal` DECIMAL(66,31) NULL,\
	`decimal2` DECIMAL NULL,\
	`dec` DEC NULL,\
	`numeric`NUMERIC NULL,\
	`fixed` FIXED NULL,\
	PRIMARY KEY (`idtable1`))\
  ENGINE = InnoDB";

const lines = sqlStatement.split("\n");

lines.forEach((line) => {
	const result = generator.DECIMAL(line);

	if (result) {
		console.log(result.validator(1.1));
	}
});
