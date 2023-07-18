import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';

export const load = (async () => {
	const response = await prisma.$transaction([
		prisma.v_inequalities_example.count(),
		prisma.v_inequalities_example.count({ where: { checked: false } }),
		prisma.v_inequalities_example.findMany({
			where: { checked: false, flagged: false, },
			//where: { og: true },
			take: 50
		})
	]);

	const [total, count, vars] = response;

	return {
		total,
		count,
		vars
	};
}) satisfies PageServerLoad;
