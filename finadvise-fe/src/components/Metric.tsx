interface MetricProps {
    iconSrc: string;
    value: string | number;
    label: string;
}

export default function Metric({ iconSrc, value, label }: MetricProps) {
    return (
        <div className="metric">
            <img src={iconSrc} alt="" className="metric__icon" />
            <div className="metric__value">{value}</div>
            <div className="metric__label">{label}</div>
        </div>
    );
}