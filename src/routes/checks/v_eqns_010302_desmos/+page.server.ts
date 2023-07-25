import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';

const table = 'v_eqns_010302';

export const load = (async () => {
	const response = await prisma.$transaction([
		prisma[table].count(),
		prisma[table].count({ where: { checked: false } }),
		prisma[table].findMany({
			where: { 
				checked: false, flagged: false,
				//id: 'id1121truetrue'
			},
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
