/**
 * This files is for generate objects with validations for the
 * MySQL database, where each line has to be in SQL language.
 *
 * Every method has as param a line, and test that for his type,
 * then, if it's relevant, return the name of column, the size
 * in elements of value (for BIT and String types), his general
 * type (binary, integer, decimal or string), if could be null
 * and a function that validate values.
 *
 * In future this will be compatible with other Databases.
 */

// Contraints for check data types
const SUPERIOR_LIMIT_BIT = 64; // Defines the max length of a bit entry

const INFERIOR_INTEGER_LIMIT_DECIMAL = 1; // Defines the minumum integer digits for DECIMAL type
const SUPERIOR_INTEGER_LIMIT_DECIMAL = 64; // Defines the maximum integer digits for DECIMAL type

const INFERIOR_FRACTIONAL_LIMIT_DECIMAL = 1; // Defines the minumum fractional digits for DECIMAL type
const SUPERIOR_FRACTIONAL_LIMIT_DECIMAL = 29; // Defines the maximum fractional digits for DECIMAL type

// Binary sequence
const BIT = (line) => {
	const regex = /(BIT\(\d{1,2}\))/g; // Regular expression to match if line has BIT(m) declaration and get the m.

	if (regex.test(line)) {
		const size = parseInt(line.match(regex)[0].match(/\d{1,2}/g), 10);
		if (size > SUPERIOR_LIMIT_BIT) throw Error("ERR_INVALID_SIZE");

		const elements = line.trim().split(" ");

		const info = {
			name: elements[0].replace(/(\'|`)/g, ""), // eslint-disable-line
			size,
			type: "binary",
			nullable: !elements.includes("NOT"),
			validator: (binarySequence) => {
				const match = binarySequence.match(/[01]+/g);

				return (match[0].length === binarySequence.length);
			},
		};

		return info;
	}

	return false;
};

/**
 * In MySQL integer values could be declared with a display option, that complete the value with zeros
 * if is minor, but for logical operations it's irrelevant. The capture group (\(\d+\)) in all regexs get this
 * value, but for now they are ignored.
 */

// TINYINT
const TINYINT = (line) => {
	const regex = /(TINYINT(\(\d+\))?)/g;

	if (regex.test(line)) {
		const elements = line.trim().split(" ");

		const info = {
			name: elements[0].replace(/(\'|`)/g, ""), // eslint-disable-line
			type: "number",
			nullable: !elements.includes("NOT"),
			validator: (tinyInt) => {
				const value = parseInt(tinyInt, 10);
				return ((value > -128) && (value < 256)); // Validate the both, signed and unsigned
			},
		};

		// Anotates the max and min size for signed and unsigned TINYINT
		if (elements.includes("UNSIGNED")) {
			info.size = {
				max: 255,
				min: 0,
			};
		} else {
			info.size = {
				max: 127,
				min: -127,
			};
		}

		return info;
	}

	return false;
};

// SMALLINT
const SMALLINT = (line) => {
	const regex = /(SMALLINT(\(\d+\))?)/g;

	if (regex.test(line)) {
		const elements = line.trim().split(" ");

		const info = {
			name: elements[0].replace(/(\'|`)/g, ""), // eslint-disable-line
			type: "number",
			nullable: !elements.includes("NOT"),
			validator: (smallInt) => {
				const value = parseInt(smallInt, 10);
				return ((value > -32769) && (value < 65335)); // Validate the both, signed and unsigned
			},
		};

		// Anotates the max and min size for signed and unsigned SMALLINT
		if (elements.includes("UNSIGNED")) {
			info.size = {
				max: 65334,
				min: 0,
			};
		} else {
			info.size = {
				max: 32767,
				min: -32768,
			};
		}

		return info;
	}

	return false;
};

// MEDIUMINT
const MEDIUMINT = (line) => {
	const regex = /(MEDIUMINT(\(\d+\))?)/g;

	if (regex.test(line)) {
		const elements = line.trim().split(" ");

		const info = {
			name: elements[0].replace(/(\'|`)/g, ""), // eslint-disable-line
			type: "number",
			nullable: !elements.includes("NOT"),
			validator: (mediumInt) => {
				const value = parseInt(mediumInt, 10);
				return ((value > -8388609) && (value < 16777216)); // Validate the both, signed and unsigned
			},
		};

		// Anotates the max and min size for signed and unsigned MEDIUMINT
		if (elements.includes("UNSIGNED")) {
			info.size = {
				max: 16777215,
				min: 0,
			};
		} else {
			info.size = {
				max: 8388607,
				min: -8388608,
			};
		}

		return info;
	}

	return false;
};

// INT
const INT = (line) => {
	const regex = /(INTEGER(\(\d+\))?)|(\bINT(\(\d+\))?)/g;

	if (regex.test(line)) {
		const elements = line.trim().split(" ");

		const info = {
			name: elements[0].replace(/(\'|`)/g, ""), // eslint-disable-line
			type: "number",
			nullable: !elements.includes("NOT"),
			validator: (int) => {
				const value = parseInt(int, 10);
				return ((value > -2147483649) && (value < 4294967296)); // Validate the both, signed and unsigned
			},
		};

		// Anotates the max and min size for signed and unsigned INT
		if (elements.includes("UNSIGNED")) {
			info.size = {
				max: 4294967296,
				min: 0,
			};
		} else {
			info.size = {
				max: 2147483647,
				min: -2147483648,
			};
		}

		return info;
	}

	return false;
};

// For keep isomorphism with MySQL
const INTEGER = INT;

// BIGINT
const BIGINT = (line) => {
	const regex = /(BIGINT(\(\d+\))?)/g;

	if (regex.test(line)) {
		const elements = line.trim().split(" ");

		const info = {
			name: elements[0].replace(/(\'|`)/g, ""), // eslint-disable-line
			type: "number",
			nullable: !elements.includes("NOT"),
			validator: (bigInt) => {
				const value = parseInt(bigInt, 10);
				return ((value > -((2 ** 63) - 1)) && (value < (2 ** 63))); // Validate the both, signed and unsigned
			},
		};

		// Anotates the max and min size for signed and unsigned BIGINT
		if (elements.includes("UNSIGNED")) {
			info.size = {
				max: (2 ** 64) - 1,
				min: 0,
			};
		} else {
			info.size = {
				max: (2 ** 63) - 1,
				min: -((2 ** 63) - 1),
			};
		}

		return info;
	}

	return false;
};

// BOOL
const BOOL = (line) => {
	const regex = /(BOOLEAN)|(\bBOOL)/g;

	if (regex.test(line)) {
		const elements = line.trim().split(" ");

		const info = {
			name: elements[0].replace(/(\'|`)/g, ""), // eslint-disable-line
			type: "boolean",
			nullable: !elements.includes("NOT"),

			// Accept every value that could be defined in JS
			validator: bool => (bool ? true : false), // eslint-disable-line
		};

		return info;
	}

	return false;
};

// For keep isomorphism with MySQL
const BOOLEAN = BOOL;

/**
 * Floating point declarations
 */
const DECIMAL = (line) => {
	// The logest regex to match all possible equivalent types
	const regex = /(DECIMAL(\(\d+(,\d+)?\))?)|(\bDEC(\(\d+(,\d+)?\))?)|(\bNUMERIC(\(\d+(,\d+)?\))?)|(\bFIXED(\(\d+(,\d+)?\))?)/g;

	if (regex.test(line)) {
		const elements = line.trim().split(" ");

		const info = {
			name: elements[0].replace(/(\'|`)/g, ""), // eslint-disable-line
			type: "float",
			nullable: !elements.includes("NOT"),

			/**
			 * Validate only numbers with explicit point, to keep clear that is a floating point number,
			 * because of that decision, the input must be a string or will be lost the fractional part
			 * when is [somenumber].0
			 */
			validator: (decimal) => {
				const validator = /(-?\d+)\.(\d+)/g;
				const result = validator.exec(decimal);

				if (!result) return false;

				// Check for max constraints, the minumum is get by regex
				if (result[1].length > SUPERIOR_INTEGER_LIMIT_DECIMAL) throw Error("ERR_INTEGER_PART_TOO_BIG");
				if (result[2].length > SUPERIOR_FRACTIONAL_LIMIT_DECIMAL) throw Error("ERR_FRACTIONAL_PART_TOO_BIG");

				return true;
			},
		};

		/**
		 * Anotates the max and min size for signed and unsigned DECIMAL.
		 * Unsigned numbers only deactivate negative parts in this case.
		 */
		if (elements.includes("UNSIGNED")) {
			info.size = {
				max: (10 ** 65) - (10 ** -30), // A number with 64 nines in integer part and 29 nines in fractional part
				min: 0,
			};
		} else {
			info.size = {
				max: (10 ** 65) - (10 ** -30),
				min: -(10 ** 65) - (10 ** -30),
			};
		}

		return info;
	}

	return false;
};

// To keep compatibility
const DEC = DECIMAL;
const NUMERIC = DECIMAL;
const FIXED = DECIMAL;

/**
 * The FLOAT and DOUBLE type in MySQL is defined by a implementation
 * of IEEE 754, this means that number could be virtually Infinity,
 * if the mantissa is 0. To keep that in mind the max value
 * in info is Infinity.
 *
 * In fact every number in JS could be represented by a double precision
 * floating point number, and when his limit is reached this came a Infinity.
 */
const FLOAT = (line) => {
	const regex = /(FLOAT(\(\d+(,\d+)?\))?)/g;

	if (regex.test(line)) {
		const elements = line.trim().split(" ");

		const info = {
			name: elements[0].replace(/(\'|`)/g, ""), // eslint-disable-line
			type: "float",
			nullable: !elements.includes("NOT"),

			/**
			 * Validate only numbers with explicit point, to keep clear that is a floating point number,
			 * because of that decision, the input must be a string or will be lost the fractional part
			 * when is [somenumber].0
			 *
			 * Not validate the max digits cause is calculated only by his bits. (Are really floating)
			 */
			validator: (float) => {
				const validator = /(-?\d+)\.(\d+)/g;
				const result = validator.exec(float);

				if (!result) return false;
				return true;
			},
		};

		/**
		 * Anotates the max and min size for signed and unsigned FLOAT.
		 * Unsigned numbers only deactivate negative parts in this case.
		 */
		if (elements.includes("UNSIGNED")) {
			info.size = {
				max: Infinity, // Depends of hardware, without defined limit
				min: 0,
			};
		} else {
			info.size = {
				max: Infinity,
				min: -Infinity,
			};
		}

		return info;
	}

	return false;
};

/**
 * Essentially this is the same check of FLOAT, only the regex is different,
 * but in future the method will help to calculate the minimum, max and
 * medium values of each row in a table.
 */
const DOUBLE = (line) => {
	const regex = /(\bDOUBLE PRECISION(\(\d+(,\d+)?\))?)|(DOUBLE(\(\d+(,\d+)?\))?)|(\bREAL(\(\d+(,\d+)?\))?)/g;

	if (regex.test(line)) {
		const elements = line.trim().split(" ");

		const info = {
			name: elements[0].replace(/(\'|`)/g, ""), // eslint-disable-line
			type: "float",
			nullable: !elements.includes("NOT"),

			/**
			 * Validate only numbers with explicit point, to keep clear that is a floating point number,
			 * because of that decision, the input must be a string or will be lost the fractional part
			 * when is [somenumber].0
			 *
			 * Not validate the max digits cause is calculated only by his bits. (Are really floating)
			 */
			validator: (float) => {
				const validator = /(-?\d+)\.(\d+)/g;
				const result = validator.exec(float);

				if (!result) return false;
				return true;
			},
		};

		/**
		 * Anotates the max and min size for signed and unsigned FLOAT.
		 * Unsigned numbers only deactivate negative parts in this case.
		 */
		if (elements.includes("UNSIGNED")) {
			info.size = {
				max: Infinity, // Depends of hardware, without defined limit
				min: 0,
			};
		} else {
			info.size = {
				max: Infinity,
				min: -Infinity,
			};
		}

		return info;
	}

	return false;
};

// To keep compatibility
const DOUBLE_PRECISION = DOUBLE;
const REAL = DOUBLE;

module.exports = {
	BIT,
	TINYINT,
	SMALLINT,
	MEDIUMINT,
	INT,
	INTEGER,
	BIGINT,
	BOOL,
	BOOLEAN,
	DECIMAL,
	DEC,
	NUMERIC,
	FIXED,
	FLOAT,
	DOUBLE,
	DOUBLE_PRECISION,
	REAL,
};
