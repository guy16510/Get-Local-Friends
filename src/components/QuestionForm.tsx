// src/components/QuestionForm.tsx
import React from 'react';
import {
  CheckboxField,
  SelectField,
  SliderField,
  SwitchField,
  TextField,
  Flex,
  Text,
} from '@aws-amplify/ui-react';
import { Question } from '../data/questions';

interface QuestionFormProps {
  question: Question;
  value: any;
  onChange: (field: string, value: any) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, value, onChange }) => {
  // Common handler for text/select fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(question.field, e.target.value);
  };

  // For switch type (yes/no questions)
  if (question.type === 'switch') {
    return (
      <SwitchField
        label={question.label}
        name={question.field}
        checked={Boolean(value)}
        onChange={(e) => onChange(question.field, e.target.checked)}
        isRequired={question.required}
      />
    );
  }

  // For slider type (e.g. age range)
  if (question.type === 'slider') {
    return (
      <SliderField
        label={question.label}
        name={question.field}
        value={value ?? question.defaultValue}
        onChange={(val: number) => onChange(question.field, val)}
        min={question.min || 0}
        max={question.max || 100}
        step={1}
        isRequired={question.required}
      />
    );
  }

  // For select fields (dropdowns)
  if (question.type === 'select' && question.options) {
    return (
      <SelectField
        label={question.label}
        name={question.field}
        value={value || ''}
        onChange={handleChange}
        isRequired={question.required}
      >
        <option value="">Select one</option>
        {question.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </SelectField>
    );
  }

  // For checkbox fields (multi-select options)
  if (question.type === 'checkbox' && question.options) {
    const handleCheckboxChange = (option: string) => {
      if (Array.isArray(value)) {
        if (value.includes(option)) {
          onChange(question.field, value.filter((v: string) => v !== option));
        } else {
          onChange(question.field, [...value, option]);
        }
      } else {
        onChange(question.field, [option]);
      }
    };

    return (
      <Flex direction="column" gap="1rem">
        <Text>{question.label}</Text>
        <Flex wrap="wrap" gap="1rem">
          {question.options.map((option) => (
            <CheckboxField
              key={option}
              label={option}
              name={question.field}
              value={option}
              checked={Array.isArray(value) && value.includes(option)}
              onChange={() => handleCheckboxChange(option)}
            />
          ))}
        </Flex>
      </Flex>
    );
  }

  // Default: Render a text field (for text, email, password, etc.)
  return (
    <TextField
      label={question.label}
      name={question.field}
      type={question.type}
      value={value || ''}
      onChange={handleChange}
      isRequired={question.required}
    />
  );
};

export default QuestionForm;