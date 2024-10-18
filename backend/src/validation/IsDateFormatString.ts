import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isValid, parse } from 'date-fns';

export function IsDateFormatString(
  formatString: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateFormatString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return isValid(parse(value, formatString, new Date()));
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a ${formatString} date format string.`;
        },
      },
    });
  };
}

export default IsDateFormatString;
