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

// Binary sequence
const BIT = (line) => {
	const regex = /(BIT\(\d{1,2}\))/g; // Regular expression to match if line has BIT(m) declaration and get the m.

	if (regex.test(line)) {
		const size = parseInt(line.match(regex)[0].match(/\d{1,2}/g), 10);
		if (size > 65) throw Error("ERR_INVALID_SIZE");

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
 * In MySQL integer values could be declared with a display otpion, that complete the value with zeros
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

		// Anotates the max and min size for signed and unsigned TINYINT
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

		// Anotates the max and min size for signed and unsigned TINYINT
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

		// Anotates the max and min size for signed and unsigned TINYINT
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

		// Anotates the max and min size for signed and unsigned TINYINT
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
};
