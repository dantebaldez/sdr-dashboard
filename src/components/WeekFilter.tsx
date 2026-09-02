interface WeekFilterProps {
	startDate: string;
	onChange: (date: string) => void;
}

export function WeekFilter({ startDate, onChange }: WeekFilterProps) {
	return (
		<div className="week-filter">
			<label htmlFor="inicio-semana">Início da semana</label>
			<input
				id="inicio-semana"
				type="date"
				value={startDate}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}