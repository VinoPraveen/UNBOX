import { Shuffle } from 'lucide-react';
import './PlaygroundInput.css';

function valueToText(value, type) {
  if (type === 'array') {
    if (Array.isArray(value)) return value.join(', ');
    return value === undefined || value === null ? '' : String(value);
  }
  if (value === '' || value === null || value === undefined) return '';
  return value;
}

export default function PlaygroundInput({ field, value, onChange, error, onRandom, onPreset }) {
  const { id, label, type, placeholder, help } = field;
  const isTextarea = type === 'array';
  const showTools = isTextarea && (field.randomize || field.presets);

  const inputProps = {
    id,
    className: 'playground-input__field',
    placeholder: placeholder ?? '',
    onChange: (e) => onChange(e.target.value),
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

      {showTools && (
        <div className="playground-input__tools">
          {field.randomize ? (
            <button
              type="button"
              className="btn btn-ghost playground-input__tool"
              onClick={() => onRandom(id)}
            >
              <Shuffle size={14} aria-hidden="true" />
              Generate Random Array
            </button>
          ) : null}
          {field.presets ? (
            <div className="playground-input__preset">
              <label
                className="playground-input__preset-label"
                htmlFor={`${id}-preset`}
              >
                Presets
              </label>
              <select
                id={`${id}-preset`}
                className="playground-input__select"
                value=""
                onChange={(e) => onPreset(id, Number(e.target.value))}
                aria-label={`${label} presets`}
              >
                <option value="" disabled>
                  Array presets\u2026
                </option>
                {field.presets.map((preset, index) => (
                  <option key={preset.label} value={index}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      )}

      {error ? (
        <span className="playground-input__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}