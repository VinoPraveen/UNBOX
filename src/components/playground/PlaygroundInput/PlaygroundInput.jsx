import './PlaygroundInput.css';

function valueToText(value, type) {
  if (type === 'array') {
    if (Array.isArray(value)) return value.join(', ');
    return value === undefined || value === null ? '' : String(value);
  }
  if (value === '' || value === null || value === undefined) return '';
  return value;
}

export default function PlaygroundInput({ field, value, onChange, error }) {
  const { id, label, type, placeholder, help } = field;

  const isTextarea = type === 'array';

  const handleChange = (raw) => {
    onChange(raw);
  };

  const inputProps = {
    id,
    className: 'playground-input__field',
    placeholder: placeholder ?? '',
    onChange: (e) => handleChange(e.target.value),
    value: valueToText(value, type),
  };

  if (type === 'number') {
    inputProps.type = 'text';
    inputProps.inputMode = 'decimal';
  }

  return (
    <div className={'playground-input' + (error ? ' input-invalid' : '')}>
      <label className="playground-input__label" htmlFor={id}>
        {label}
      </label>
      {isTextarea ? (
        <textarea {...inputProps} rows={2} aria-describedby={help ? `${id}-help` : undefined} />
      ) : (
        <input {...inputProps} aria-describedby={help ? `${id}-help` : undefined} />
      )}
      {help ? (
        <span className="playground-input__help" id={`${id}-help`}>
          {help}
        </span>
      ) : null}
      {error ? (
        <span className="playground-input__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
