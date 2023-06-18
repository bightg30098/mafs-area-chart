import { faker } from "@faker-js/faker";

export type MyData = {
	x: number;
	y: number;
};

export function generateData(prev: MyData, delta: MyData) {
	return {
		x: prev.x + delta.x,
		y:
			prev.y +
			faker.number.float({ min: 0.001, max: 0.002, precision: 0.0001 }),
	};
}
