const { JSDOM } = require("jsdom");

function getURLsFromHTML(htmlBody, baseURL) {
	const urls = [];
	const dom = new JSDOM(htmlBody);
	const linkElements = dom.window.document.querySelectorAll("a");

	for (const linkElement of linkElements) {
		if (linkElement.href.startsWith("/")) {
			try {
				const urlObj = new URL(`${baseURL}${linkElement.href}`);
				urls.push(urlObj.href);
			} catch (error) {
				console.log(`Error: ${error.message}`);
			}
		} else {
			try {
				const urlObj = new URL(linkElement.href);
				urls.push(urlObj.href);
			} catch (error) {
				console.log(`Error: ${error.message}`);
			}
		}
	}

	return urls;
}

function normalizeURL(urlString) {
	const urlObj = new URL(urlString);
	const hostPath = `${urlObj.hostname}${urlObj.pathname}`;

	return hostPath.replace(/\/$/, "");
}

module.exports = {
	getURLsFromHTML,
	normalizeURL,
};
