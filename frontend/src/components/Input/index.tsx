import React, {
  FocusEvent,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useState,
} from 'react';
import { IconType } from 'react-icons/lib';
import { Container, InputContainer } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: IconType;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ value, label, icon: Icon, onFocus, onBlur, onChange, ...rest }, inputRef) => {
    const [active, setActive] = useState(() => {
      if (value) {
        return value.toString().length > 0;
      }

      return false;
    });

    const handleInputFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setActive(true);

        if (onFocus) {
          onFocus(event);
        }
      },
      [onFocus],
    );

    const handleInputBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setActive(event.target.value.length > 0);

        if (onBlur) {
          onBlur(event);
        }
      },
      [onBlur],
    );

    const handleInputChange = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        if (onChange) {
          onChange(event);
        }
      },
      [onChange],
    );

    return (
      <Container active={active}>
        <InputContainer
          value={value}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          ref={inputRef}
          {...rest}
        />
        {label && <label>{label}</label>}
        {Icon && <Icon size={19} />}
      </Container>
    );
  },
);

export default Input;
