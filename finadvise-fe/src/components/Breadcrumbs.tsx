import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    url?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    if (!items || items.length === 0) return null;

    return (
        <nav className="breadcrumbs" aria-label="breadcrumb">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <span key={index} className="breadcrumbs__item">
                        {item.url && !isLast ? (
                            <Link to={item.url} className="breadcrumbs__link">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="breadcrumbs__current" aria-current={isLast ? "page" : undefined}>
                                {item.label}
                            </span>
                        )}
                        {!isLast && <span className="breadcrumbs__separator">/</span>}
                    </span>
                );
            })}
        </nav>
    );
}