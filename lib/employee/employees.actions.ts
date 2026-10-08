'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Pool } from "pg";
import { QueryBuilder } from '../query-builder';
import { employee, IemployeeForm } from './employees.definitions';
import { convertDateStr, convertDecimalStr } from '../utils';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, ssl: true
});

export async function createemployee(data: IemployeeForm) {
  const request = getRequest(data);
  const qb = new QueryBuilder("employees")
    .setFromObject(request);

  const { query, values } = qb.insert();

  const client = await pool.connect();

  try {
    await client.query(query, values);
  }
  catch (error) {
    console.error(error)

    return {
      message: 'Erro ao cadastrar colaborador',
    };
  }
  finally {
    client.release();
  }

  revalidatePath('/dashboard/colaboradores');
  redirect('/dashboard/colaboradores');
}
export async function updateemployee(
  id: string,
  data: IemployeeForm
) {
  const request = getRequest(data);
  const qb = new QueryBuilder("employees")
    .setFromObject(request);

  const { query, values } = qb.update({ id });

  const client = await pool.connect();

  try {
    await client.query(query, values);
  } catch (error) {
    console.error(error)
    return { message: 'Erro ao atualizar colaborador' };
  }

  revalidatePath('/dashboard/colaboradores');
  redirect('/dashboard/colaboradores');
}

export async function deleteemployee(id: string) {
  const qb = new QueryBuilder("employees");

  const { query, values } = qb.delete({ id });

  const client = await pool.connect();

  try {
    await client.query(query, values);
  } catch (error) {
    console.error(error)
    console.log('Erro ao deletar colaborador');
  }
  revalidatePath('/dashboard/caminhoes');
}

function getRequest(data: IemployeeForm) {
  const request: Partial<employee> = {
    ...data,
    id: '',
    birth_date: convertDateStr(data.birth_date),
    commission_percentage: convertDecimalStr(data.commission_percentage)
  };

  return request;
}
