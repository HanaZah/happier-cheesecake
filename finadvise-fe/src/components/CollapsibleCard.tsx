import { useState, type ReactNode } from 'react';
import Card from './Card';

interface CollapsibleCardProps {
    title: string;
    children: ReactNode;
    defaultExpanded?: boolean;
    className?: string;
}

export default function CollapsibleCard({ title, children, defaultExpanded = true, className = '' }: CollapsibleCardProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <Card className={`collapsible-card ${className}`.trim()}>
            <div
                className="collapsible-card__header"
                onClick={() => setIsExpanded(!isExpanded)}
                role="button"
                aria-expanded={isExpanded}
            >
                <h2 className="collapsible-card__title">{title}</h2>
                <img
                    src="/img/arrow_right.svg"
                    alt="Zobrazit/skrýt sekci"
                    className={`collapsible-card__icon ${isExpanded ? 'collapsible-card__icon--expanded' : ''}`.trim()}
                />
            </div>
            {isExpanded && <div className="collapsible-card__content">{children}</div>}
        </Card>
    );
}