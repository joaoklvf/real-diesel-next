'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Pool } from "pg";
import { QueryBuilder } from '../query-builder';
import { Driver, IDriverForm } from './drivers.definitions';
import { convertDateStr, convertDecimalStr } from '../utils';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, ssl: true
});

export async function createDriver(data: IDriverForm) {
  const request = getRequest(data);
  const qb = new QueryBuilder("drivers")
    .setFromObject(request);

  const { query, values } = qb.insert();

  const client = await pool.connect();

  try {
    await client.query(query, values);
  }
  catch (error) {
    console.error(error)

    return {
      message: 'Erro ao cadastrar motorista',
    };
  }
  finally {
    client.release();
  }

  revalidatePath('/dashboard/motoristas');
  redirect('/dashboard/motoristas');
}
export async function updateDriver(
  id: string,
  data: IDriverForm
) {
  const request = getRequest(data);
  const qb = new QueryBuilder("drivers")
    .setFromObject(request);

  const { query, values } = qb.update({ id });

  const client = await pool.connect();

  try {
    await client.query(query, values);
  } catch (error) {
    console.error(error)
    return { message: 'Erro ao atualizar motorista' };
  }

  revalidatePath('/dashboard/motoristas');
  redirect('/dashboard/motoristas');
}

export async function deleteDriver(id: string) {
  const qb = new QueryBuilder("drivers");

  const { query, values } = qb.delete({ id });

  const client = await pool.connect();

  try {
    await client.query(query, values);
  } catch (error) {
    console.error(error)
    console.log('Erro ao deletar motorista');
  }
  revalidatePath('/dashboard/caminhoes');
}

function getRequest(data: IDriverForm) {
  const request: Partial<Driver> = {
    ...data,
    id: '',
    birth_date: convertDateStr(data.birth_date),
    commission_percentage: convertDecimalStr(data.commission_percentage)
  };

  return request;
}
