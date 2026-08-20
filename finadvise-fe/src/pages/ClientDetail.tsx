import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import CollapsibleCard from '../components/CollapsibleCard';
import { useApiClient } from '../hooks/useApiClient';

// --- DTO Interfaces mirroring Backend Records ---
interface AddressDTO {
    id: number;
    street: string;
    houseNumber: string;
    city: string;
    postalCode: string;
}

interface AdvisorSummaryDTO {
    employeeId: string;
    firstName: string;
    lastName: string;
}

interface BudgetItemDTO {
    amount: number;
    typeId: number;
    typeName: string;
    isMandatory: boolean;
}

interface FullBudgetDTO {
    incomes: BudgetItemDTO[];
    expenses: BudgetItemDTO[];
    totalCashFlow: number;
}

interface ProductsStatisticsDTO {
    total: number;
    active: number;
    activeManagedByRequester: number;
    totalMonthlyPayment: number;
}

interface ClientDetailDTO {
    version: number;
    clientUid: string;
    firstName: string;
    lastName: string;
    personalId: string;
    birthDate: string;
    occupation: string;
    phone: string;
    email: string;
    idCardNumber: string;
    idCardIssuer: string;
    idCardIssueDate: string;
    idCardExpiryDate: string;
    lastUpdate: string;
    isActive: boolean;
    advisor: AdvisorSummaryDTO;
    permanentAddress: AddressDTO;
    contactAddress: AddressDTO;
    budget: FullBudgetDTO;
    productsStatistics: ProductsStatisticsDTO;
}

export default function ClientDetail() {
    const { id } = useParams<{ id: string }>();
    const apiFetch = useApiClient();

    const [client, setClient] = useState<ClientDetailDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await apiFetch(`/api/v1/clients/${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Klient nebyl nalezen.');
                    }
                    throw new Error('Nepodařilo se načíst detail klienta.');
                }
                const data = await response.json();
                setClient(data);
            } catch (err) {
                 if (err instanceof Error && err.message !== 'Authentication failed: Token is stale or invalid.') {
                    setError(err.message || 'Chyba při komunikaci se serverem.');
                 }
            }
        };

        if (id) {
            void fetchClient();
        }

    }, [id, apiFetch]);

    // --- Formatting Utilities ---
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (isoString: string | null | undefined) => {
        if (!isoString) return '';
        const [year, month, day] = isoString.split('-');
        return `${parseInt(day, 10)}. ${parseInt(month, 10)}. ${year}`;
    };

    const formatAddress = (addr: AddressDTO | null | undefined) => {
        if (!addr) return 'Neuvedeno';
        return `${addr.street} ${addr.houseNumber}, ${addr.postalCode} ${addr.city}`;
    };

    if (error) return <div className="page-wrapper"><div className="alert alert--error">{error}</div></div>;
    if (!client) return <div className="page-wrapper"><p>Načítám data...</p></div>;

    return (
        <main className="page-wrapper">
            <div className="page-header">
                <Breadcrumbs items={[
                    { label: 'Dashboard', url: '/dashboard' },
                    { label: 'Detail klienta' }
                ]} />
            </div>

            <div className="card-grid">
                {/* ZÁKLADNÍ ÚDAJE */}
                <CollapsibleCard title="Základní údaje">
                    <h3 className="detail-header">{client.firstName} {client.lastName} ({client.occupation})</h3>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Rodné číslo</span>
                            <span className="detail-value">{client.personalId}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Datum narození</span>
                            <span className="detail-value">{formatDate(client.birthDate)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Telefon</span>
                            <span className="detail-value">{client.phone}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Email</span>
                            <span className="detail-value">{client.email}</span>
                        </div>
                        <div className="detail-item detail-item--full">
                            <span className="detail-label">Trvalé bydliště</span>
                            <span className="detail-value">{formatAddress(client.permanentAddress)}</span>
                        </div>
                        <div className="detail-item detail-item--full">
                            <span className="detail-label">Kontaktní adresa</span>
                            <span className="detail-value">{formatAddress(client.contactAddress)}</span>
                        </div>
                    </div>

                    <div className="detail-footer">
                        <span className="detail-footer__meta">Aktualizováno: {formatDate(client.lastUpdate)}</span>
                        <Link to={`/client-edit/${client.clientUid}`} className="link-text">Upravit údaje</Link>
                    </div>
                </CollapsibleCard>

                {/* DOKLAD TOTOŽNOSTI */}
                <CollapsibleCard title="Doklad totožnosti">
                    <h3 className="detail-header">OP: {client.idCardNumber}</h3>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Vydáno</span>
                            <span className="detail-value">{formatDate(client.idCardIssueDate)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Platnost do</span>
                            <span className="detail-value">{formatDate(client.idCardExpiryDate)}</span>
                        </div>
                        <div className="detail-item detail-item--full">
                            <span className="detail-label">Vystavil</span>
                            <span className="detail-value">{client.idCardIssuer}</span>
                        </div>
                    </div>

                    <div className="detail-footer">
                        <Link to={`/client-edit/${client.clientUid}#idcard`} className="link-text">Upravit doklad</Link>
                    </div>
                </CollapsibleCard>

                {/* ROZPOČET */}
                <CollapsibleCard title="Rozpočet">
                    <h3 className="detail-header">
                        {client.budget.totalCashFlow > 0 ? '+ ' : ''}{formatCurrency(client.budget.totalCashFlow)} / měs.
                    </h3>

                    <div className="budget-section">
                        <h4 className="budget-section__title budget-section__title--income">PŘÍJMY</h4>
                        <ul className="budget-list">
                            {client.budget.incomes.map((item, idx) => (
                                <li key={idx} className="budget-list__item">
                                    <span>{item.typeName}</span>
                                    <span className="detail-value">{formatCurrency(item.amount)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="budget-section">
                        <h4 className="budget-section__title budget-section__title--expense">VÝDAJE</h4>
                        <ul className="budget-list">
                            {client.budget.expenses.map((item, idx) => (
                                <li key={idx} className="budget-list__item">
                                    <span>{item.typeName}</span>
                                    <span className="detail-value">{formatCurrency(item.amount)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="detail-footer">
                        <Link to={`/client-budget/${client.clientUid}`} className="link-text">Upravit rozpočet</Link>
                    </div>
                </CollapsibleCard>

                {/* PRODUKTY */}
                <CollapsibleCard title="Produkty">
                    <h3 className="detail-header">Celkem: {client.productsStatistics.total}</h3>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Aktivní</span>
                            <span className="detail-value">{client.productsStatistics.active}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Z toho mnou spravované</span>
                            <span className="detail-value">{client.productsStatistics.activeManagedByRequester}</span>
                        </div>
                        <div className="detail-item detail-item--full">
                            <span className="detail-label">Měsíční platba celkem</span>
                            <span className="detail-value">{formatCurrency(client.productsStatistics.totalMonthlyPayment)}</span>
                        </div>
                    </div>

                    <div className="detail-footer">
                        <Link
                            to={`/client-products/${client.clientUid}`}
                            className="link-text detail-footer__action--left"
                        >
                            Zobrazit produkty
                        </Link>

                        <Link to={`/client-products/new/${client.clientUid}`} className="link-text">Přidat produkt</Link>
                    </div>
                </CollapsibleCard>
            </div>
        </main>
    );
}