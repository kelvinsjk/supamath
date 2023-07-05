import { prisma } from '$lib/prisma';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PW } from '$env/static/private';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = params.id;
	//console.log(await request.json());
	const { pw, outcome } = await request.json();

	if (pw === PW) {
		if (outcome === 'checked' || outcome === 'flagged') {
			const data: { checked: true; flagged?: boolean } = { checked: true };
			if (outcome === 'flagged') {
				data.flagged = true;
			}
			const updatedVars = await prisma.v2022p1q1.update({
				where: { id },
				data
			});
			//
			return json(updatedVars);
		}
	}
	throw error(404, `${pw}, ${outcome}`);
};
