import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidRut } from '../utils/rut.utils';

@ValidatorConstraint({ async: false })
export class IsRutConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return isValidRut(value);
  }

  defaultMessage() {
    return 'El RUT ($value) no es válido';
  }
}
export function IsRut(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRutConstraint,
    });
  };
}
