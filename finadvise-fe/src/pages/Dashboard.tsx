import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Metric from '../components/Metric';
import Card from '../components/Card';
import { useApiClient } from '../hooks/useApiClient';

interface ClientStatisticsDTO {
    activeProducts: number;
    cashFlow: number;
}

interface ClientOverviewDTO {
    clientUid: string;
    firstName: string;
    lastName: string;
    occupation: string;
    statistics: ClientStatisticsDTO;
}

export default function Dashboard() {
    const [clients, setClients] = useState<ClientOverviewDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const apiFetch = useApiClient();

    useEffect(() => {
        const fetchRecentClients = async () => {
            try {
                const response = await apiFetch('/api/v1/clients/recent?limit=6');
                if (!response.ok) throw new Error('Failed to fetch recent clients');
                const data = await response.json();
                setClients(data);
            } catch (err) {
                if (err instanceof Error && err.message !== 'Authentication failed: Token is stale or invalid.') {
                    setError('Chyba při načítání dat ze serveru.');
                }
            }
        };

        void fetchRecentClients();
    }, [apiFetch]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <main className="dashboard">
            <h1 className="dashboard__title">Poslední upravení klienti</h1>

            {error && <div className="alert alert--error">{error}</div>}

            <section className="dashboard__grid">
                {clients.map((client) => (
                    <Card key={client.clientUid} className="client-card">
                        <div className="client-card__header">
                            <h2 className="client-card__name">{client.firstName} {client.lastName}</h2>
                            <div className="client-card__occupation">{client.occupation}</div>
                        </div>

                        <div className="client-card__metrics">
                            <Metric iconSrc="/img/produkty.svg" value={client.statistics.activeProducts} label="Aktivní produkty" />
                            <Metric iconSrc="/img/cashflow.svg" value={formatCurrency(client.statistics.cashFlow)} label="Volný cashflow" />
                        </div>

                        <Link to={`/client-detail/${client.clientUid}`} className="btn btn--outline btn--block">
                            Detail
                        </Link>
                    </Card>
                ))}

                <Card className="action-card">
                    <Link to="/client-new" className="action-card__link">
                        <img src="/img/plus.svg" alt="" className="action-card__icon" />
                        <h2 className="action-card__title">Nový klient</h2>
                    </Link>
                </Card>
            </section>
        </main>
    );
}