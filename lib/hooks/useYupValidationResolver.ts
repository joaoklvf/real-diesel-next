import { useCallback } from 'react';

import { AnyObjectSchema, ValidationError } from 'yup';

export function useYupVaLidationResolver<T extends object>(validationSchema: AnyObjectSchema) {
  return useCallback(
    async (data: T) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (error_) {
        return {
          values: {},
          errors: (error_ as ValidationError).inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path as string]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {},
          ),
        };
      }
    },
    [validationSchema],
  );
}
