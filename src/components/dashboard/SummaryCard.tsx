import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
}

const SummaryCard = ({ title, value, icon: Icon, }: SummaryCardProps) => {
    return (
        <article className="summary-card">
            <div className="summary-card-icon">
                <Icon size={22} />
            </div>

            <div>
                <p className="summary-card-title">{title}</p>
                <h3 className="summary-card-value">{value}</h3>
            </div>
        </article>
    );
};

export default SummaryCard;