import fastglob from "fast-glob";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default async () => {
	let sites = await fastglob("./src/_data/builtwith/*.json", {
		caseSensitiveMatch: false
	});

	let map = {};

	for(let site of sites) {
		let filename = site.split("/").pop();
		let siteData = require(`./builtwith/${filename}`);

		let twitter;
		let github;
		let usernames = [siteData.opened_by, siteData._backup_opened_by].filter(entry => !!entry);
		for(let u of usernames) {
			if(u.startsWith("twitter:")) {
				twitter = u.substring("twitter:".length);
			} else {
				github = u;
			}
		}

		if(twitter && github) {
			if(!map[github]) {
				map[github] = [];
			}
			if(!map[github].includes(twitter)) {
				map[github].push(twitter);
			}
		}
	}

	return map;
};
