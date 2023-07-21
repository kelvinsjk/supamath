import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';

export const load = (async () => {
	const response = await prisma.$transaction([
		prisma.v_eqns_010301.count(),
		prisma.v_eqns_010301.count({ where: { checked: false } }),
		prisma.v_eqns_010301.findMany({
			where: { checked: false, flagged: false },
			//where: { og: true },
			take: 50,
		}),
	]);

	const [total, count, vars] = response;

	return {
		total,
		count,
		vars,
	};
}) satisfies PageServerLoad;
