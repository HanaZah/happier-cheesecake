import type {InputHTMLAttributes} from 'react';

interface TextFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    error?: string;
}

export default function TextFormField({ label, id, error, className = '', ...rest }: TextFormFieldProps) {
    return (
        <div className={`form-field ${className}`.trim()}>
            <label htmlFor={id} className="form-field__label">{label}</label>
            <input
                id={id}
                className={`form-field__input ${error ? 'form-field__input--error' : ''}`}
                {...rest}
            />
            {error && <span className="form-field__error-text">{error}</span>}
        </div>
    );
}