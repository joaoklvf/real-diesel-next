import postgres from 'postgres';
import { employee, employeeField, employeesTable } from './employees.definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;

export async function fetchemployees() {
  try {
    const employees = await sql<employeeField[]>`
      SELECT
        id,
        name
      FROM employees
      ORDER BY name ASC
    `;

    return employees;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all employees.');
  }
}

export async function fetchFilteredemployees(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const employees = await sql<employeesTable[]>`
      SELECT
        *
      FROM employees
      WHERE
        name ILIKE ${`%${query}%`} OR
        rg ILIKE ${`%${query}%`} OR
        cpf ILIKE ${`%${query}%`} OR
        birth_date::text ILIKE ${`%${query}%`} OR
        commission_percentage::text ILIKE ${`%${query}%`} OR
        phone_number ILIKE ${`%${query}%`}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    
    return employees;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch employees.');
  }
}

export async function fetchemployeesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM employees
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
    throw new Error('Failed to fetch total number of employees.');
  }
}

export async function fetchemployeeById(id: string) {
  try {
    const data = await sql<employee[]>`
      SELECT
        *
      FROM employees
      WHERE employees.id = ${id};
    `;

    const employee = data.map((employee) => ({
      ...employee,
    }));

    return employee[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch employee.');
  }
}
