const { query } = require("../configuration/dbConfig");

// Helper: build WHERE clause from object
const buildWhereClause = (whereObj = {}) => {
  const keys = Object.keys(whereObj);
  const clause = keys.map(key => `${key} = ?`).join(" AND ");
  const values = keys.map(key => whereObj[key]);
  return { clause, values };
};

const queryModel = {
  insert: async (table, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => "?").join(", ");
    const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`;
    return query(sql, values);
  },

  update: async (table, whereObj, data) => {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(", ");
    const setValues = Object.values(data);
    const { clause: whereClause, values: whereValues } = buildWhereClause(whereObj);
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    return query(sql, [...setValues, ...whereValues]);
  },

  findOne: async (table, whereObj = {}, columns = "*") => {
    const { clause, values } = buildWhereClause(whereObj);
    const sql = `SELECT ${columns} FROM ${table} WHERE ${clause} LIMIT 1`;
    const result = await query(sql, values);
    return result[0] || null;
  },

  findAll: async ({
    table,
    where = {},
    columns = "*",
    joins = "",
    orderBy = "",
    groupBy = "",
    limit = null,
  }) => {
    const { clause, values } = buildWhereClause(where);
    let sql = `SELECT ${columns} FROM ${table} ${joins}`;

    if (clause) sql += ` WHERE ${clause}`;
    if (groupBy) sql += ` GROUP BY ${groupBy}`;
    if (orderBy) sql += ` ORDER BY ${orderBy}`;
    if (limit) sql += ` LIMIT ${limit}`;

    return query(sql, values);
  },

  delete: async (table, whereObj) => {
    const { clause, values } = buildWhereClause(whereObj);
    const sql = `DELETE FROM ${table} WHERE ${clause}`;
    return query(sql, values);
  }
};

module.exports = queryModel;
