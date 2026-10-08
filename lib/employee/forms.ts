import { FieldMapper } from "../definitions";
import { IemployeeForm } from "./employees.definitions";

export const employee_FIELDS: FieldMapper<IemployeeForm> = [
  { label: 'Nome', name: 'name', icon: 'UserIcon', maxLength: 1000 },
  { label: 'RG', name: 'rg', icon: 'DocumentIcon', maxLength: 12 },
  { label: 'CPF', name: 'cpf', icon: 'DocumentIcon', maxLength: 14 },
  { label: 'Data de nascimento', name: 'birth_date', icon: 'CalendarIcon', fieldType: 'date-picker' },
  { label: 'Número de telefone', name: 'phone_number', icon: 'PhoneIcon', maxLength: 15 },
  { label: 'Comissão', name: 'commission_percentage', icon: 'CurrencyDollarIcon', fieldType: 'input-mask', mask: 'percent', maxLength: 6 },
];
