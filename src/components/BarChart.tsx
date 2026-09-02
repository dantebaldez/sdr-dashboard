import { useRef, useState } from 'react';
import { copySvgAsPng } from '../utils/exportSvgAsPng';

interface BarChartProps {
	title: string;
	data: { label: string; value: number }[];
	color: string;
}

const WIDTH = 480;
const HEIGHT = 260;
const PADDING = 40;

export function BarChart({ title, data, color }: BarChartProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [status, setStatus] = useState<'idle' | 'copiado' | 'erro'>('idle');
	const maxValue = Math.max(1, ...data.map((d) => d.value));
	const barWidth = data.length > 0 ? (WIDTH - PADDING * 2) / data.length : 0;

	async function handleCopy() {
		if (!svgRef.current) return;
		try {
			await copySvgAsPng(svgRef.current);
			setStatus('copiado');
		} catch {
			setStatus('erro');
		} finally {
			setTimeout(() => setStatus('idle'), 2000);
		}
	}

	const labelBotao =
		status === 'copiado' ? 'Copiado!' : status === 'erro' ? 'Erro ao copiar' : 'Copiar imagem';

	return (
		<div className="chart-block">
			<div className="chart-header">
				<h3>{title}</h3>
				<button className="btn-secondary" onClick={handleCopy}>
					{labelBotao}
				</button>
			</div>

			{data.length === 0 ? (
				<p className="empty-state">Sem dados nessa semana.</p>
			) : (
				<svg
					ref={svgRef}
					width={WIDTH}
					height={HEIGHT}
					viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect width={WIDTH} height={HEIGHT} fill="#ffffff" />
					{data.map((item, index) => {
						const barHeight = ((HEIGHT - PADDING * 2) * item.value) / maxValue;
						const x = PADDING + index * barWidth;
						const y = HEIGHT - PADDING - barHeight;

						return (
							<g key={item.label}>
								<rect
									x={x + barWidth * 0.15}
									y={y}
									width={barWidth * 0.7}
									height={barHeight}
									fill={color}
									rx={3}
								/>
								<text x={x + barWidth / 2} y={HEIGHT - PADDING + 16} textAnchor="middle" fontSize="11" fill="#1b1d1f">
									{item.label}
								</text>
								<text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill="#1b1d1f">
									{item.value}
								</text>
							</g>
						);
					})}
				</svg>
			)}
		</div>
	);
}