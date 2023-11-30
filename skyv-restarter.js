/**
 * Re-usable script for PTERODACTYL panel to restart a server.
 * This script replaces the onDeploy script
 */

const args = process.argv.slice(2);

const token = args.find((arg) => arg.startsWith('--token='))?.split('=')[1];
const serverId = args.find((arg) => arg.startsWith('--server='))?.split('=')[1];

console.log('token', token);
console.log('serverId', serverId);

if (!token || !serverId) {
	console.log('Missing arguments, exiting.');
	process.exit(1);
}

(async () => {
	try {
		// Make API request to kill-server
		const resp = await fetch(`https://ptero.skyv.top/servers/${serverId}/kill`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (!resp.ok) {
            const body = await resp.json();

			throw new Error(`Error: ${resp.status} ${body?.message || 'Unknown error'}`);
		}

		console.log(`Kill status: ${resp.status}`);
	} catch (e) {
        console.log(e)
		throw new Error(e?.response?.data?.status + ': ' + e?.response?.data?.message || e);
	}
})();
