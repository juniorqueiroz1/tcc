import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate } from 'class-validator';
import { ValidationError } from '../errors/apiErrors';

async function validateClsObject<T>(clsObject: T): Promise<void> {
  const errors = await validate(clsObject);
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}

async function transformAndValidate<T>(
  type: ClassType<T>,
  plain: object,
): Promise<T> {
  const clsObject = plainToClass(type, plain, {
    excludeExtraneousValues: true,
  });

  await validateClsObject(clsObject);

  return clsObject;
}

export default transformAndValidate;
