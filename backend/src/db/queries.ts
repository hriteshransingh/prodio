import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  users,
  comments,
  products,
  type NewUser,
  type NewProduct,
  type NewComment,
} from "./schema";

// USER QUERY

export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning();

  return user; // Here user is an array of the inserted user, we return the first element of the array
};

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) });
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const existingUser = await getUserById(id);

  if (!existingUser) {
    throw new Error(`User with id ${id} not found`);
  }
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning(); //it will return that updated user
  return user;
};

//upsert will create a new user if the user with the given id does not exist, otherwise it will uodate the existing user with the new data.

export const upsertUser = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.id,
      set: data,
    })
    .returning();
  return user;
};

//PRODUCT QUERY

export const createProduct = async (data: NewProduct) => {
  const [product] = await db.insert(products).values(data).returning();

  return product;
};

export const getAllProducts = async (id: string) => {
  return db.query.products.findMany({
    with: { users: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)], //latest product first
    //the square brackets are required because drizzle ORM's orderBy expects an array
  });
};

export const getProductById = async (id: string) => {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      users: true,
      comments: {
        with: { users: true },
      },
    },
    orderBy: (comments, { desc }) => [desc(comments.createdAt)],
  });
};

export const getProductsByUserId = async (userId: string) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { users: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
  const existingProduct = await getProductById(id);

  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();

  return product;
};

export const deleteProduct = async (id: string) => {
  const existingProduct = await getProductById(id);

  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return product;
};

// COMMENT QUERY

export const createComment = async (data: NewComment) => {
  const [comment] = await db.insert(comments).values(data).returning();

  return comment;
};

export const deleteComment = async (id: string) => {
  const existingComment = await getCommentById(id);

  if (!existingComment) {
    throw new Error(`Comment with id ${id} not found`);
  }

  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return comment;
};

export const getCommentById = async (id: string) => {
  return db.query.comments.findFirst({
    where: eq(comments.id, id),

    with: { users: true },
  });
};
