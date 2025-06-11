import React from 'react';
import PropTypes from 'prop-types';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options = [], // For select type
  rows = 3, // For textarea type
  className = '',
  labelClassName = '',
  inputClassName = '',
  ...rest
}) => {
  const commonProps = {
    value,
    onChange,
    placeholder,
    required,
    className: inputClassName,
    id: name,
    name,
    ...rest
  };

  let control;
  switch (type) {
    case 'select':
      control = <Select options={options} {...commonProps} />;
      break;
    case 'textarea':
      control = <Textarea rows={rows} {...commonProps} />;
      break;
    default:
      control = <Input type={type} {...commonProps} />;
  }

  return (
    <div className={className}>
      {label && <Label htmlFor={name} className={labelClassName}>{label}{required && ' *'}</Label>}
      {control}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'date', 'select', 'textarea']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
  })),
  rows: PropTypes.number,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default FormField;