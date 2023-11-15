const { normalizeURL } = require("../src/crawl");
const { expect } = require("@jest/globals");

describe("normalizeURL", () => {
	it("strips https protocol from the url input", () => {
		const urlString = "https://example.com/path";
		const actual = normalizeURL(urlString);
		const expected = "example.com/path";

		expect(actual).toEqual(expected);
	});

	it("strips http protocol from the url input", () => {
		const urlString = "http://example.com/path";
		const actual = normalizeURL(urlString);
		const expected = "example.com/path";

		expect(actual).toEqual(expected);
	});

	it("strips trailing `/` from the url input", () => {
		const urlString = "https://example.com/path/";
		const actual = normalizeURL(urlString);
		const expected = "example.com/path";

		expect(actual).toEqual(expected);
	});

	it("downcases url input that contains capital letters", () => {
		const urlString = "https://ExAmPlE.cOm/path";
		const actual = normalizeURL(urlString);
		const expected = "example.com/path";

		expect(actual).toEqual(expected);
	});
});
