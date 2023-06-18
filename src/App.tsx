import { useState, startTransition } from "react";
import { generateData } from "./mock-data";
import { Coordinates, Line, Mafs, Polygon, Theme } from "mafs";
import { useInterval, useMeasure } from "react-use";
import { twMerge } from "tailwind-merge";

import "mafs/core.css";
import "mafs/font.css";

// 70ms
const INTERVAL = 70;

function App() {
	const [data, setData] = useState<{
		polygons: [number, number][];
		points: [number, number][];
	}>({ polygons: [], points: [] });

	const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();
	const [start, setStart] = useState(false);
	const [time, setTime] = useState(0);

	useInterval(
		() => {
			startTransition(() => {
				setData(({ points, polygons }) => {
					const [x, y] = points.at(-1) ?? [0, 0];
					const delta = INTERVAL / (60 * 1000);

					const mockData = generateData({ x, y }, { x: delta, y: delta });

					if (points.length === 0) {
						return {
							points: [
								[0, 0],
								[mockData.x, mockData.y],
							],
							polygons: [
								[0, 0],
								[0, mockData.y],
								[mockData.x, mockData.y],
								[mockData.x, 0],
							],
						};
					}

					points.push([mockData.x, mockData.y]);

					polygons.pop();
					polygons.push([mockData.x, mockData.y], [mockData.x, 0]);

					return {
						points: points.slice(),
						polygons: polygons.slice(),
					};
				});
			});
		},
		start ? INTERVAL : null,
	);

	useInterval(() => setTime((prev) => prev + 1), start ? 1000 : null);

	return (
		<div className="w-screen h-screen bg-gray-950" ref={containerRef}>
			<span className="absolute top-5 right-32 text-gray-50">{time}</span>
			<button
				className={twMerge(
					"absolute top-4 right-4 rounded px-2 py-0.5 bg-green-300 hover:bg-green-400 w-16",
					start && "bg-red-300 hover:bg-red-400",
				)}
				type="button"
				onClick={() => {
					console.log({ data });
					setStart((prev) => !prev);
				}}
			>
				{start ? "Pause" : "Start"}
			</button>
			<Mafs
				viewBox={{ x: [0, 6], y: [0, 6] }}
				preserveAspectRatio={false}
				width={width}
				height={height}
			>
				<Coordinates.Cartesian />

				<Polygon
					points={data.polygons}
					color={Theme.yellow}
					// svgPolygonProps={{ strokeWidth: 0 }}
				/>
				{/* {data.points.map((d, i) => (
					<Line.Segment point1={d} point2={data.points[i - 1] ?? d} />
				))} */}
			</Mafs>
		</div>
	);
}

export default App;
