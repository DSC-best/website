/**
 * Re-usable script for PTERODACTYL panel to restart a server.
 * This script replaces the onDeploy script
 */

const axios = require("axios");

const args = process.argv.slice(2);

const token = args.find((arg) => arg.startsWith("--token="))?.split("=")[1];
const serverId = args.find((arg) => arg.startsWith("--server="))?.split("=")[1];

if (!token || !serverId) {
	console.log("Missing arguments, exiting.");
	process.exit(1);
}

const http = axios.create({
	baseURL: "https://ptero.skyv.top",
});

(async () => {
	try {
		// Make API request to kill-server
		const { status, data } = await http.post(
			`/servers/${serverId}/kill`,
			{},
			{
				headers: {
					Authorization: `${token}`,
				},
			},
		);

		console.log(`Kill status: ${status}, message: ${data?.message}`);
	} catch (e) {
		throw new Error(
			e?.response?.data?.status + ": " + e?.response?.data?.message || e,
		);
	}
})();
