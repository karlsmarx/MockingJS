const generator = require("./generator.js");

/* eslint-disable*/
const sqlStatement = "CREATE TABLE IF NOT EXISTS `mydb`.`table1`( \n \
`id`INT NOT NULL, \n \
`table1col` BIT(32) NULL, \n \
`table1col1` TINYINT(1) UNSIGNED NULL, \n \
	`table1col1` TINYINT UNSIGNED NULL, \n \
	`table1col1` TINYINT UNSIGNED NOT NULL, \n \
	`table1col1` TINYINT NULL, \n \
`table1col2` SMALLINT(1) UNSIGNED NULL, \n \
	`table1col2` SMALLINT UNSIGNED NULL, \n \
`table1col3` MEDIUMINT(1) NULL, \n \
	`table1col3` MEDIUMINT NULL, \n \
`table1col4` INT(1) NULL, \n \
	`table1col4` INT NULL, \n \
`table1col4` INTEGER(1) NULL, \n \
	`table1col4` INTEGER NULL, \n \
`table1col5` BIGINT(1) NULL, \n \
	`table1col5` BIGINT NULL, \n \
`table1col5` BOOL NULL, \n \
`table1col5` BOOLEAN NULL, \n \
PRIMARY KEY(`id`)) \n \
ENGINE = InnoDB;";

const lines = sqlStatement.split("\n");

lines.forEach((line) => {
	const result = generator.BIGINT(line);

	if (result) {
		console.log(result);
	}
});
