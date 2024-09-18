const { v4: uuid } = require('uuid');

const db = require('./db');
const { generateKey } = require('./generate');

const KEY_LENGTH = 32;

module.exports.Links = {
  table: process.env.TABLE_SHORTENER,
  include: ['path', 'url', 'timestamp', 'account'],
  schema: ({ path, url, account }) => ({
    path,
    url,
    timestamp: Date.now(),
    account: account || 'anonymous',
    query: 0,
  }),
  async get(path) {
    try {
      return { data: await db.get(this.table, { path }, this.include) };
    } catch (error) {
      return { error };
    }
  },
  async put(item) {
    try {
      await db.put(this.table, this.schema(item));
    } catch (e) {
      return e;
    }
  },
};

module.exports.Users = {
  table: process.env.TABLE_USERS,
  include: ['id', 'email', 'secret', 'created', 'code'],
  schema: async ({ email }) => ({
    id: uuid(),
    secret: await generateKey(KEY_LENGTH),
    email,
    created: Date.now(),
    query: 0,
  }),
  async get(id) {
    try {
      return { user: await db.get(this.table, { id }, this.include) };
    } catch (error) {
      return { error };
    }
  },
  async put(user_) {
    const user = await this.schema(user_);
    try {
      await db.put(this.table, user);
      delete user.query;
      return { user };
    } catch (error) {
      return { error };
    }
  },
  async update(id, { add, remove }) {
    try {
      return {
        user: (await db.update(this.table, { id: { id }, add, remove }))
          .Attributes,
      };
    } catch (error) {
      return { error };
    }
  },
  async findByEmail(email) {
    try {
      return {
        user: (
          await db.query(this.table, {
            key: 'email',
            value: email,
            include: this.include,
          })
        )[0],
      };
    } catch (error) {
      return { error };
    }
  },
};
