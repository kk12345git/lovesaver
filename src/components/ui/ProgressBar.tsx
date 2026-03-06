interface ProgressBarProps {
    value: number; // 0–100
    color?: string;
    height?: string;
    showLabel?: boolean;
    label?: string;
}

export default function ProgressBar({
    value,
    color = "#FF6FAE",
    height = "h-3",
    showLabel = false,
    label,
}: ProgressBarProps) {
    const clampedValue = Math.min(100, Math.max(0, value));
    const isOver = value > 80;

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                    <span>{label || ""}</span>
                    <span style={{ color: isOver ? "#FF4DA6" : color }}>
                        {clampedValue}%
                    </span>
                </div>
            )}
            <div className={`w-full bg-pink-100 rounded-full ${height} overflow-hidden`}>
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                        width: `${clampedValue}%`,
                        background: isOver
                            ? "linear-gradient(90deg, #FF6FAE, #FF4DA6)"
                            : `linear-gradient(90deg, ${color}99, ${color})`,
                    }}
                />
            </div>
        </div>
    );
}
