function normalizeURL(urlString) {
	const urlObj = new URL(urlString);
	const hostPath = `${urlObj.hostname}${urlObj.pathname}`;

	return hostPath.replace(/\/$/, "");
}

module.exports = {
	normalizeURL,
};
