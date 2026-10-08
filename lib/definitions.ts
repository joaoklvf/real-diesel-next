import * as yup from 'yup';
import { removeNonNumericCaracteres } from './utils';
import { ChangeEvent, HTMLInputTypeAttribute } from 'react';
import { MaskType } from '@/components/interfaces';
import { IconProps } from '@/components/icon/interfaces';
import { Path } from 'react-hook-form';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export const DEFAULT_STRING_REQUIRED = yup.string().required('Campo obrigatório.').trim().min(1, 'Campo obrigatório.');

export const DEFAULT_STRING_NULLABLE = yup.string().trim().nullable().optional();
export const DEFAULT_NUMBER = yup
  .string()
  .trim()
  .test(
    'must-be-valid-number',
    'Deve ser um número válido.',
    (val?: string) => val === undefined || val === '' || !Number.isNaN(Number(removeNonNumericCaracteres(val))),
  );

export const DEFAULT_NUMBER_NULLABLE = DEFAULT_NUMBER.optional();
export const DEFAULT_NUMBER_REQUIRED = DEFAULT_NUMBER.required('Campo obrigatório');

export interface IOption {
  label: string,
  value: string | number
}

type FieldTypes = 'input' | 'date-picker' | 'input-mask' | 'select';
export type FieldMapper<T> = {
  label: string;
  name: Path<T>;
  icon: IconProps['name'];
  fieldType?: FieldTypes;
  readOnly?: boolean;
  mask?: MaskType;
  options?: IOption[];
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  maxLength?: number;
  type?: HTMLInputTypeAttribute;
  step?: number | string;
}[];
