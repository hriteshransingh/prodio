import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("user_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  products: many(products), // one user -> many products
  comments: many(comments), // one user -> many comments
}));

export const productRelations = relations(products, ({ many, one }) => ({
  comments: many(comments), // one product -> many comments
  // fields - the foreign key columnn of this table (products.userId)
  // references - the foreign key column of the related table(users.id)

  users: one(users, { fields: [products.userId], references: [users.id] }),
  // one product -> one user
}));

//Comments relations : A comment belongs to one user and one product

export const commentRelations = relations(comments, ({ one }) => ({
  //comments.userId foreign key references users.id primary key
  users: one(users, { fields: [comments.userId], references: [users.id] }), // one comment -> one user
  //comments.userId foreign key references products.id primary key
  products: one(products, {
    fields: [comments.userId],
    references: [products.id],
  }), // one comment-> one product
}));

//type inference
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
