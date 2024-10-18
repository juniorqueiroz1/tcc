import React, { forwardRef } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { Container, SelectContainer } from './styles';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  options?: SelectOption[];
}

const SelectInput: React.RefForwardingComponent<
  HTMLSelectElement,
  SelectInputProps
> = ({ placeholder, options = [], ...rest }, inputRef) => {
  return (
    <Container>
      <FaAngleDown size={17} />
      <SelectContainer ref={inputRef} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </SelectContainer>
    </Container>
  );
};

export default forwardRef(SelectInput);
