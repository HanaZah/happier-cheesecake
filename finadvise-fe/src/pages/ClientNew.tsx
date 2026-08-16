import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Card from '../components/Card';
import TextFormField from '../components/TextFormField';
import DateFormField from '../components/DateFormField';
import { useApiClient } from '../hooks/useApiClient';
import type { SubmitEvent } from 'react';

export default function ClientNew() {
    const navigate = useNavigate();
    const apiFetch = useApiClient();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setGlobalError(null);

        const formData = new FormData(e.currentTarget);

        // Reconstruct flat form data into the nested DTO structure expected by the backend
        const payload = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            personalId: formData.get('personalId'),
            birthDate: formData.get('birthDate'),
            occupation: formData.get('occupation'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            idCardNumber: formData.get('idCardNumber'),
            idCardIssueDate: formData.get('idCardIssueDate'),
            idCardExpiryDate: formData.get('idCardExpiryDate'),
            idCardIssuer: formData.get('idCardIssuer'),
            residentialAddress: {
                street: formData.get('residentialAddress.street'),
                houseNumber: formData.get('residentialAddress.houseNumber'),
                city: formData.get('residentialAddress.city'),
                postalCode: formData.get('residentialAddress.postalCode'),
            },
            contactAddress: {
                street: formData.get('contactAddress.street'),
                houseNumber: formData.get('contactAddress.houseNumber'),
                city: formData.get('contactAddress.city'),
                postalCode: formData.get('contactAddress.postalCode'),
            }
        };

        try {
            const response = await apiFetch('/api/v1/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/dashboard');
            } else if (response.status === 400 || response.status === 409) {
                const data = await response.json();
                if (data.invalid_params) {
                    setErrors(data.invalid_params);
                } else {
                    setGlobalError(data.detail || 'Operaci se nepodařilo dokončit.');
                }
            } else {
                setGlobalError('Neočekávaná chyba serveru.');
            }
        } catch (err) {
            if (err instanceof Error && err.message !== 'Authentication failed: Token is stale or invalid.') {
                setGlobalError('Chyba při komunikaci se serverem.');
            }
        }
    };

    return (
        <main className="page-wrapper">
            <div className="page-header">
                <Breadcrumbs items={[
                    { label: 'Dashboard', url: '/dashboard' },
                    { label: 'Nový klient' }
                ]} />
            </div>

            {globalError && <div className="alert alert--error mb-4">{globalError}</div>}

            <form onSubmit={handleSubmit} className="form-layout" noValidate>
                <div className="card-grid">
                    {/* ZÁKLADNÍ ÚDAJE */}
                    <Card className="form-card">
                        <h2 className="form-card__title">Základní údaje</h2>
                        <div className="form-grid">
                            <TextFormField label="Jméno" id="firstName" name="firstName" error={errors['firstName']} />
                            <TextFormField label="Příjmení" id="lastName" name="lastName" error={errors['lastName']} />
                            <DateFormField label="Datum narození" id="birthDate" name="birthDate" error={errors['birthDate']} />
                            <TextFormField label="Rodné číslo" id="personalId" name="personalId" error={errors['personalId']} />
                            <TextFormField label="Telefon" id="phone" name="phone" error={errors['phone']} />
                            <TextFormField label="Email" id="email" name="email" type="email" error={errors['email']} />
                            <TextFormField
                                label="Zaměstnání"
                                id="occupation"
                                name="occupation"
                                className="form-grid__full"
                                error={errors['occupation']}
                            />
                        </div>
                    </Card>

                    {/* ÚDAJE Z OP */}
                    <Card className="form-card">
                        <h2 className="form-card__title">Údaje z OP</h2>
                        <div className="form-grid">
                            <TextFormField
                                label="Číslo OP"
                                id="idCardNumber"
                                name="idCardNumber"
                                className="form-grid__full"
                                error={errors['idCardNumber']}
                            />
                            <TextFormField
                                label="Vydávající úřad"
                                id="idCardIssuer"
                                name="idCardIssuer"
                                className="form-grid__full"
                                error={errors['idCardIssuer']}
                            />
                            <DateFormField
                                label="Datum vydání"
                                id="idCardIssueDate"
                                name="idCardIssueDate"
                                className="form-grid__full"
                                error={errors['idCardIssueDate']} />
                            <DateFormField
                                label="Datum expirace"
                                id="idCardExpiryDate"
                                name="idCardExpiryDate"
                                className="form-grid__full"
                                error={errors['idCardExpiryDate']} />
                        </div>
                    </Card>

                    {/* TRVALÁ ADRESA */}
                    <Card className="form-card">
                        <h2 className="form-card__title">Trvalá adresa</h2>
                        <div className="form-grid">
                            <TextFormField label="Město" id="res_city" name="residentialAddress.city" error={errors['residentialAddress.city']} />
                            <TextFormField label="PSČ" id="res_postalCode" name="residentialAddress.postalCode" error={errors['residentialAddress.postalCode']} />
                            <TextFormField
                                label="Ulice"
                                id="res_street"
                                name="residentialAddress.street"
                                className="form-grid__full"
                                error={errors['residentialAddress.street']}
                            />
                            <TextFormField
                                label="Číslo popisné (příp. orientační)"
                                id="res_houseNumber"
                                name="residentialAddress.houseNumber"
                                className="form-grid__full"
                                error={errors['residentialAddress.houseNumber']}
                            />
                        </div>
                    </Card>

                    {/* KONTAKTNÍ ADRESA */}
                    <Card className="form-card">
                        <h2 className="form-card__title">Kontaktní adresa</h2>
                        <div className="form-grid">
                            <TextFormField label="Město" id="con_city" name="contactAddress.city" error={errors['contactAddress.city']} />
                            <TextFormField label="PSČ" id="con_postalCode" name="contactAddress.postalCode" error={errors['contactAddress.postalCode']} />
                            <TextFormField
                                label="Ulice"
                                id="con_street"
                                name="contactAddress.street"
                                className="form-grid__full"
                                error={errors['contactAddress.street']}
                            />
                            <TextFormField
                                label="Číslo popisné (příp. orientační)"
                                id="con_houseNumber"
                                name="contactAddress.houseNumber"
                                className="form-grid__full"
                                error={errors['contactAddress.houseNumber']}
                            />
                        </div>
                    </Card>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn--primary btn--block btn--large">
                        Uložit
                    </button>
                    <p className="form-actions__hint">Všechna pole jsou povinná.</p>
                </div>
            </form>
        </main>
    );
}