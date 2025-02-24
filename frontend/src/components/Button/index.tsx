import React from 'react';
import { ButtonContainer, Loading } from './styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'normal' | 'small';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  variant = 'primary',
  size = 'normal',
  loading = false,
  ...rest
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loading /> : children}
    </ButtonContainer>
  );
};

export default Button;
