import type { Request, Response } from "express";
import { db } from "../db/connection.js";
import { users, type NewUser } from "../db/schema.js";
import { hashPasswords, comparedPasswords } from "../utils/password.js";
import { generateToken, type JwtPayload } from "../utils/jwt.js";
import { eq } from "drizzle-orm";

export const registerUser = async (
  req: Request<any, any, NewUser>,
  res: Response,
) => {
  try {
    // 1. Look up if a user exists with this email
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, req.body.email),
    });

    // 2. If they do, stop right here and send a clean response
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email is already registered", userExists: true });
    }

    const hashedPasswod = await hashPasswords(req.body.password);

    const [user] = await db
      .insert(users)
      .values({ ...req.body, password: hashedPasswod })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      });
    if (!user) {
      return res.status(400).json({ error: "Failed to create user account" });
    }
    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.name,
    });
    return res.status(201).json({ message: "new user created", user, token });
  } catch (e) {
    console.error("Registration failed", e);
    res
      .status(400)
      .json({ message: "Registration failed internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValidatedPassword = await comparedPasswords(
      password,
      user.password,
    );

    if (!isValidatedPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.name,
    });

    return res.status(200).json({
      message: "login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (e) {
    console.log("Login error", e);
    return res.status(500).json({ message: "Failed to login" });
  }
};
