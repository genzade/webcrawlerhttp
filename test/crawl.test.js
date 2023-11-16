const { getURLsFromHTML, normalizeURL } = require("../src/crawl");
const { expect, describe } = require("@jest/globals");

describe("normalizeURL", () => {
	it("strips https protocol from the url input", () => {
		const urlString = "https://example.com/path";
		const actual = normalizeURL(urlString);

		const expected = "example.com/path";

		expect(actual).toEqual(expected);
	});

	// when("url input is a relative path", () => {
	it("strips http protocol from the url input", () => {
		const urlString = "http://example.com/path";
		const actual = normalizeURL(urlString);
		const expected = "example.com/path";

		expect(actual).toEqual(expected);
	});
	// });

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

describe("getURLsFromHTML", () => {
	// when no urls are found
	it("returns an empty array when no urls are found", () => {
		const htmlBody = `
      <html>
        <body>
          <p>Some text</p>
        </body>
      </html>
    `;
		const baseURL = "https://example.com";
		const actual = getURLsFromHTML(htmlBody, baseURL);
		const expected = [];

		expect(actual).toEqual(expected);
	});

	// when one url is found
	it("returns an array of urls found", () => {
		const htmlBody = `
      <html>
        <body>
          <a href="https://another.example.com">Another Example</a>
        </body>
      </html>
    `;

		const baseURL = "https://example.com";
		const actual = getURLsFromHTML(htmlBody, baseURL);
		const expected = ["https://another.example.com/"];

		expect(actual).toEqual(expected);
	});

	// when multiple urls are found
	it("returns an array of urls found", () => {
		const htmlBody = `
      <html>
        <body>
          <a href="https://another.example.com">Another Example</a>
          <a href="https://yet-another.example.com">Yet Another Example</a>
        </body>
      </html>
    `;
		const baseURL = "https://example.com";
		const actual = getURLsFromHTML(htmlBody, baseURL);
		const expected = [
			"https://another.example.com/",
			"https://yet-another.example.com/",
		];

		expect(actual).toEqual(expected);
	});

	// when relative urls are found
	it("returns an array of urls found", () => {
		const htmlBody = `
      <html>
        <body>
          <a href="/another">Another Example</a>
          <a href="/yet-another">Yet Another Example</a>
        </body>
      </html>
    `;
		const baseURL = "https://example.com";
		const actual = getURLsFromHTML(htmlBody, baseURL);
		const expected = [
			"https://example.com/another",
			"https://example.com/yet-another",
		];

		expect(actual).toEqual(expected);
	});

	// when page has both relative and absolute urls
	it("returns an array of urls found", () => {
		const htmlBody = `
      <html>
        <body>
          <a href="/another">Another Example</a>
          <a href="https://yet-another.example.com">Yet Another Example</a>
        </body>
      </html>
    `;
		const baseURL = "https://example.com";
		const actual = getURLsFromHTML(htmlBody, baseURL);
		const expected = [
			"https://example.com/another",
			"https://yet-another.example.com/",
		];

		expect(actual).toEqual(expected);
	});

	// when page has invalid url
	it("returns an array of urls found", () => {
		const htmlBody = `
      <html>
        <body>
          <a href="invalid">Example</a>
        </body>
      </html>
    `;
		const baseURL = "https://example.com";
		const actual = getURLsFromHTML(htmlBody, baseURL);
		const expected = [];

		expect(actual).toEqual(expected);
	});
});
