// src/components/QuestionForm.tsx
import React from 'react';
import { TextField, CheckboxField, SwitchField, SelectField } from '@aws-amplify/ui-react';
import { Question } from '../data/questions';

interface QuestionFormProps {
  question: Question;
  value: any;
  onChange: (field: string, value: any) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, value, onChange }) => {
  const { field, label, type, options, multi } = question;

  switch (type) {
    case 'location':
      // We'll store location as an object { lat, lng } in `formData[field]`.
      const latVal = value?.lat ?? '';
      const lngVal = value?.lng ?? '';
      return (
        <>
          <label>{label}</label>
          <TextField
            label="Latitude"
            value={latVal}
            onChange={(e) =>
              onChange(field, {
                ...value,
                lat: e.target.value,
              })
            }
          />
          <TextField
            label="Longitude"
            value={lngVal}
            onChange={(e) =>
              onChange(field, {
                ...value,
                lng: e.target.value,
              })
            }
          />
        </>
      );

    case 'text':
    case 'email':
    case 'password':
      return (
        <TextField
          type={type}
          label={label}
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
        />
      );

    case 'checkbox':
      if (multi && options) {
        // multi-check scenario => store as an array
        const arrayVal = Array.isArray(value) ? value : [];
        return (
          <>
            <label>{label}</label>
            {options.map((opt) => (
              <CheckboxField
                key={opt}
                name={field}
                label={opt}
                value={opt}
                checked={arrayVal.includes(opt)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange(field, [...arrayVal, opt]);
                  } else {
                    onChange(field, arrayVal.filter((v: string) => v !== opt));
                  }
                }}
              />
            ))}
          </>
        );
      } else {
        // single checkbox scenario
        return (
          <CheckboxField
            label={label}
            name={field}
            checked={!!value}
            onChange={(e) => onChange(field, e.target.checked)}
          />
        );
      }

    case 'switch':
      // store as boolean
      return (
        <SwitchField
          label={label}
          isChecked={!!value}
          onChange={(e) => onChange(field, e.target.checked)}
        />
      );

    case 'select':
      if (multi && options) {
        // If user wants to pick multiple from a list in a <select> 
        // you'd need a multiple <select> or some custom approach.
        // For simplicity, let's do single select by default:
        // (If you do multi, you'd handle an array, but your schema's field is `string` or possibly `string[]`)
        return (
          <SelectField
            label={label}
            value="" // can't store multiple in a single value easily 
            onChange={(e) => {
              // Minimal approach: push selected to array
              const val = e.target.value;
              if (!val) return;
              let current = Array.isArray(value) ? value : [];
              if (!current.includes(val)) current = [...current, val];
              onChange(field, current);
            }}
          >
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </SelectField>
        );
      }
      // single select scenario
      return (
        <SelectField
          label={label}
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
        >
          <option value="">Select an option</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </SelectField>
      );

    default:
      return null;
  }
};

export default QuestionForm;