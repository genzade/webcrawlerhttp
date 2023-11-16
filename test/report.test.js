const { sortPages } = require("../src/report");
const { expect, describe } = require("@jest/globals");

describe("sortPages", () => {
	it("sorts pages by count in descending order", () => {
		const pages = {
			"https://example.com/path": 1,
			"https://example.com": 3,
		};
		const sortedPages = sortPages(pages);
		const expected = [
			["https://example.com", 3],
			["https://example.com/path", 1],
		];

		expect(sortedPages).toEqual(expected);
	});

	// when more than 2 urls are found
	it("sorts pages by count in descending order", () => {
		const pages = {
			"https://example.com/path": 1,
			"https://example.com": 3,
			"https://example.com/path2": 2,
			"https://example.com/path3": 4,
		};
		const sortedPages = sortPages(pages);
		const expected = [
			["https://example.com/path3", 4],
			["https://example.com", 3],
			["https://example.com/path2", 2],
			["https://example.com/path", 1],
		];

		expect(sortedPages).toEqual(expected);
	});
});
