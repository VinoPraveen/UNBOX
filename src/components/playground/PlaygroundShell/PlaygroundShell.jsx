import { useState, useRef } from 'react';
import PlaygroundHeader from '../PlaygroundHeader/PlaygroundHeader.jsx';
import PlaygroundInput from '../PlaygroundInput/PlaygroundInput.jsx';
import PlaygroundControls from '../PlaygroundControls/PlaygroundControls.jsx';
import PlaygroundOutput from '../PlaygroundOutput/PlaygroundOutput.jsx';
import PlaygroundStatus from '../PlaygroundStatus/PlaygroundStatus.jsx';
import './PlaygroundShell.css';

const READY = {
  kind: 'idle',
  title: 'Ready to experiment.',
  detail:
    'Enter a sorted array and a target value, then press Run to step through the search.',
};

const INVALIDATED = {
  kind: 'idle',
  title: 'Input changed. Run the experiment again.',
  detail: 'The previous result no longer matches the current input.',
};

const STANDBY = {
  kind: 'idle',
  title: 'Configuration ready.',
  detail: 'This playground has no interactive output wired up yet.',
};

function defaultValues(inputs) {
  const values = {};
  for (const field of inputs) {
    if (field && typeof field.id === 'string') {
      if (field.type === 'array') {
        values[field.id] = Array.isArray(field.defaultValue)
          ? field.defaultValue.join(', ')
          : field.defaultValue ?? '';
      } else {
        values[field.id] = field.defaultValue;
      }
    }
  }
  return values;
}

export default function PlaygroundShell({ config }) {
  const { inputs = [], operations = [] } = config;
  const [values, setValues] = useState(() => defaultValues(inputs));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(READY);
  const [experiment, setExperiment] = useState(null);
  const outputRef = useRef(null);

  const liveValidation = config.validate ? config.validate(values) : null;
  const runDisabled = Boolean(liveValidation && !liveValidation.ok);

  const handleInputChange = (id, value) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => (prev[id] ? { ...prev, [id]: undefined } : prev));
    if (config.validate) {
      const result = config.validate({ ...values, [id]: value });
      setErrors(result.errors ?? {});
    }
    if (experiment) {
      setExperiment(null);
      setStatus(INVALIDATED);
    } else {
      setStatus(READY);
    }
  };

  const scrollToOutput = () => {
    window.requestAnimationFrame(() => {
      if (outputRef.current) {
        outputRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  };

  const handleAction = (opId) => {
    if (opId === 'reset') {
      if (typeof config.onReset === 'function') {
        config.onReset(values, { setErrors, setStatus, setExperiment });
        return;
      }
      setValues(defaultValues(inputs));
      setErrors({});
      setExperiment(null);
      setStatus(READY);
      return;
    }

    if (opId === 'run') {
      if (typeof config.run === 'function') {
        config.run(values, { setErrors, setStatus, setExperiment });
      } else {
        const { errors: validationErrors, ok } = config.validate
          ? config.validate(values)
          : { ok: true, errors: {} };
        setErrors(validationErrors ?? {});
        if (!ok) {
          setStatus({
            kind: 'error',
            title: 'Please enter a valid input.',
            detail: 'Fix the highlighted fields and try again.',
          });
          return;
        }
        setStatus(config.experience === 'standby' ? STANDBY : READY);
      }
      scrollToOutput();
    }
  };

  return (
    <main className="playground">
      <PlaygroundHeader
        title={config.title}
        description={config.description}
        backTo={`/concept/${config.slug}`}
      />

      <div className="playground__grid">
        <div className="playground__panel playground__panel--left">
          <section className="playground__section" aria-label="Input">
            <span className="playground__section-label">INPUT</span>
            {inputs.length > 0 ? (
              <div className="playground__fields">
                {inputs.map((field) => (
                  <PlaygroundInput
                    key={field.id}
                    field={field}
                    value={values[field.id]}
                    error={errors[field.id]}
                    onChange={(v) => handleInputChange(field.id, v)}
                  />
                ))}
              </div>
            ) : (
              <p className="playground__empty">No configurable inputs yet.</p>
            )}
          </section>

          <section className="playground__section" aria-label="Controls">
            <span className="playground__section-label">CONTROLS</span>
            <PlaygroundControls
              operations={operations}
              onAction={handleAction}
              disabled={{ run: runDisabled }}
            />
          </section>
        </div>

        <div className="playground__panel playground__panel--right" ref={outputRef}>
          <PlaygroundOutput>
            {config.Component ? (
              <config.Component experiment={experiment} values={values} />
            ) : (
              <div className="playground__ready">
                <p className="playground__ready-title">Configuration ready.</p>
                <p className="playground__ready-text">{STANDBY.detail}</p>
              </div>
            )}
          </PlaygroundOutput>

          <PlaygroundStatus
            status={status.kind}
            title={status.title}
            detail={status.detail}
          />
        </div>
      </div>
    </main>
  );
}
