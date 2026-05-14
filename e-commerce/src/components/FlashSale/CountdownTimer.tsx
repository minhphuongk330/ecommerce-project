"use client";
import React from "react";

interface Props {
	hours: number;
	minutes: number;
	seconds: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

const TimeBlock = ({ value }: { value: string }) => (
	<div className="bg-white text-red-600 font-bold text-sm w-8 h-8 flex items-center justify-center rounded">
		{value}
	</div>
);

const CountdownTimer: React.FC<Props> = ({ hours, minutes, seconds }) => {
	return (
		<div className="flex items-center gap-1">
			<TimeBlock value={pad(hours)} />
			<span className="text-white font-bold text-lg">:</span>
			<TimeBlock value={pad(minutes)} />
			<span className="text-white font-bold text-lg">:</span>
			<TimeBlock value={pad(seconds)} />
		</div>
	);
};

export default CountdownTimer;
