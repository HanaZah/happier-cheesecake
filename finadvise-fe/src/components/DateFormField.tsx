import type {InputHTMLAttributes} from 'react';

interface DateFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    error?: string;
}

export default function DateFormField({ label, id, error, className = '', ...rest }: DateFormFieldProps) {
    return (
        <div className={`form-field ${className}`.trim()}>
            <label htmlFor={id} className="form-field__label">{label}</label>
            <input
                type="date"
                id={id}
                className={`form-field__input ${error ? 'form-field__input--error' : ''}`}
                {...rest}
            />
            {error && <span className="form-field__error-text">{error}</span>}
        </div>
    );
}