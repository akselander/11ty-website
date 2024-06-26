import getOpenCollectiveData from "./opencollective.js";

export default async function() {
	const opencollective = await getOpenCollectiveData();

	let backers = opencollective.supporters.filter(supporter => {
		return (supporter.frequency === 'MONTHLY' || supporter.frequency === 'YEARLY') &&
			supporter.status === 'ACTIVE';
	});

	let count = 0;
	let sorted = [];
	let buckets = {};
	let bucketNames = {};
	let monthlyDonations = 0;
	for(let backer of backers) {
		let amount = backer.amount.value;
		if(backer.frequency === "YEARLY") {
			amount = amount / 12;
		}
		sorted.push(amount);
		monthlyDonations += amount;
		count++;

		if(!buckets[amount]) {
			buckets[amount] = 0;
		}
		buckets[amount]++;

		if(!bucketNames[amount]) {
			bucketNames[amount] = [];
		}
		bucketNames[amount].push(backer.name);
	}

	sorted.sort((a, b) => a - b);

	return {
		contributorCount: count,
		recurringAmount: monthlyDonations,
		stats: {
			median: sorted[Math.floor(sorted.length / 2)],
			mean: monthlyDonations / count,
		},
		list: sorted,
		buckets: buckets,
		names: bucketNames,
	};
}
