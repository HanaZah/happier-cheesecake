import {type SubmitEvent, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import TextFormField from '../components/TextFormField';

export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employeeId: payload.employeeId,
                    password: payload.password
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const role = login(data.accessToken);
                navigate(role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
            } else {
                setError('Neplatné přihlašovací údaje.');
            }
        } catch {
            setError('Chyba připojení k serveru.');
        }
    };

    return (
        <main className="login">
            <div className="login-layout">
                {error && (
                    <div className="alert alert--error">{error}</div>
                )}

                <Card className="login-card">
                    <div className="login-logo">
                        <img src="/img/logo_icon.PNG" alt="FinAdvise ikona" className="login-logo__icon" />
                        <img src="/img/logo_text.PNG" alt="FinAdvise" className="login-logo__text" />
                    </div>

                    <h1 className="login-card__title">Přihlášení</h1>

                    <form onSubmit={handleSubmit}>
                        <TextFormField
                            label="Osobní číslo (ID)"
                            id="employeeId"
                            name="employeeId"
                            required
                            autoComplete="username"
                        />

                        <TextFormField
                            label="Heslo"
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                        />

                        <button type="submit" className="btn btn--primary btn--block">
                            Přihlásit
                        </button>
                        <div className="login-card__help">
                            <Link to="/404" className="link-text">Zapomněl jsem heslo</Link>
                        </div>

                    </form>
                </Card>
                <p className="login-copyright">© 2025 FinAdvise</p>
            </div>
        </main>
    );
}