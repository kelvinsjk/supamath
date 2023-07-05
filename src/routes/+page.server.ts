import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';

export const load = (async () => {
	const response = await prisma.$transaction([
		prisma.v2022p1q1.count(),
		prisma.v2022p1q1.count({ where: { checked: false } }),
		prisma.v2022p1q1.findMany({
			where: { checked: false, flagged: false, og: false },
			//where: { og: true },
			take: 5
		})
	]);

	const [total, count, vars] = response;

	return {
		total,
		count,
		vars
	};
}) satisfies PageServerLoad;
