type Value = string | number | boolean | Date | null;

export class QueryBuilder {
  private readonly table: string;
  private fields: Record<string, Value>;

  constructor(table: string) {
    this.table = table;
    this.fields = {};
  }

  // Add a field only if it's valid
  set(field: string, value?: Value): this {
    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === "string" && value.trim() === "")
    ) {
      this.fields[field] = value;
    }
    return this;
  }

  // Build INSERT query
  insert(): { query: string; values: Value[] } {
    const keys = Object.keys(this.fields);
    const placeholders = keys.map((k) => `:${k}`);

    const query = `
      INSERT INTO "${this.table}" (${keys.map((k) => `"${k}"`).join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *;
    `;

    return this.replaceNamedParams(query, this.fields);
  }

  // Build UPDATE query with named params
  update(where: Record<string, Value>): { query: string; values: Value[] } {
    const keys = Object.keys(this.fields);
    const setClause = keys.map((k) => `"${k}" = :${k}`).join(", ");

    const query = `
      UPDATE "${this.table}"
      SET ${setClause}
      WHERE ${Object.keys(where)
        .map((k) => `"${k}" = :${k}`)
        .join(" AND ")}
      RETURNING *;
    `;

    return this.replaceNamedParams(query, { ...this.fields, ...where });
  }

  // Build DELETE query with named params
  delete(where: Record<string, Value>): { query: string; values: Value[] } {
    const query = `
      DELETE FROM "${this.table}"
      WHERE ${Object.keys(where)
        .map((k) => `"${k}" = :${k}`)
        .join(" AND ")}
      RETURNING *;
    `;

    return this.replaceNamedParams(query, { ...this.fields, ...where });
  }

  setFromObject(value: object) {
    Object.entries(value).forEach(([entry, value]) => {
      if (value === 0 || (!!value && value !== Infinity && value !== 'null'))
        this.set(entry, value);
    });
    return this;
  }

  // Replace :name with $1, $2, ...
  private replaceNamedParams(query: string, params: Record<string, Value>) {
    const values: Value[] = [];
    const paramIndex: Record<string, number> = {};

    const finalQuery = query.replace(/:(\w+)/g, (_, key) => {
      if (!(key in paramIndex)) {
        paramIndex[key] = Object.keys(paramIndex).length + 1;
        values.push(params[key]);
      }
      return `$${paramIndex[key]}`;
    });

    return { query: finalQuery, values };
  }
}
