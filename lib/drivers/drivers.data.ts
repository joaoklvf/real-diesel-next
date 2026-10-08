import postgres from 'postgres';
import { Driver, DriverField, DriversTable } from './drivers.definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;

export async function fetchDrivers() {
  try {
    const drivers = await sql<DriverField[]>`
      SELECT
        id,
        name
      FROM drivers
      ORDER BY name ASC
    `;

    return drivers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all drivers.');
  }
}

export async function fetchFilteredDrivers(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const drivers = await sql<DriversTable[]>`
      SELECT
        *
      FROM drivers
      WHERE
        name ILIKE ${`%${query}%`} OR
        rg ILIKE ${`%${query}%`} OR
        cpf ILIKE ${`%${query}%`} OR
        birth_date::text ILIKE ${`%${query}%`} OR
        commission_percentage::text ILIKE ${`%${query}%`} OR
        phone_number ILIKE ${`%${query}%`}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    
    return drivers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch drivers.');
  }
}

export async function fetchDriversPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM drivers
    WHERE
      name ILIKE ${`%${query}%`} OR
      rg ILIKE ${`%${query}%`} OR
      cpf ILIKE ${`%${query}%`} OR
      birth_date::text ILIKE ${`%${query}%`} OR
      commission_percentage::text ILIKE ${`%${query}%`} OR
      phone_number ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of drivers.');
  }
}

export async function fetchDriverById(id: string) {
  try {
    const data = await sql<Driver[]>`
      SELECT
        *
      FROM drivers
      WHERE drivers.id = ${id};
    `;

    const driver = data.map((driver) => ({
      ...driver,
    }));

    return driver[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch driver.');
  }
}
