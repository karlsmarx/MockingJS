// Binary sequence
const BIT = (line) => {
	const regex = /(BIT\(\d{1,2}\))/g; // Regular expression to match if line has BIT(m) declaration and get the m.

	if (regex.test(line)) {
		const size = parseInt(line.match(regex)[0].match(/\d{1,2}/g), 10);
		const elements = line.trim().split(" ");

		const info = {
			name: elements[0].replace(/(\'|`)/g, ""), // eslint-disable-line
			size,
			type: "number",
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

module.exports = {
	BIT,
};
