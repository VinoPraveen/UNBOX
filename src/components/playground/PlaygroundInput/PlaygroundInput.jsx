import './PlaygroundInput.css';

function arrayToText(value) {
  if (!Array.isArray(value)) return '';
  return value.join(', ');
}

function textToArray(text) {
  return text
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .map((part) => {
      const num = Number(part);
      return Number.isNaN(num) ? part : num;
    });
}

export default function PlaygroundInput({ field, value, onChange, error }) {
  const { id, label, type, placeholder, help } = field;

  const handleChange = (raw) => {
    if (type === 'array') {
      onChange(textToArray(raw));
    } else if (type === 'number') {
      const trimmed = raw.trim();
      onChange(trimmed === '' ? '' : Number(trimmed));
    } else {
      onChange(raw);
    }
  };

  const isTextarea = type === 'array';

  const inputProps = {
    id,
    className: 'playground-input__field',
    placeholder: placeholder ?? '',
    onChange: (e) => handleChange(e.target.value),
  };

  if (type === 'number') {
    inputProps.type = 'number';
    inputProps.value = value === '' || value === null || value === undefined ? '' : value;
    inputProps.inputMode = 'numeric';
  } else {
    inputProps.value =
      type === 'array' ? arrayToText(value) : value === null || value === undefined ? '' : value;
  }

  return (
    <div className="playground-input">
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
