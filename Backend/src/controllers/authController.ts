import * as jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";
import mysql, { FieldInfo, MysqlError } from "mysql";

const db = require("../database/db_config");
const regexLib = require("../util/regexLibrary");

const jwt_expiration = "25m";
const jwt_refresh_expiration = "1y";

// user
interface IUser {
  user_id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

// Token gen
const generateToken = (user: IUser, secret: string, expiration: string) => {
  return jwt.sign(user, secret, { expiresIn: expiration });
};

// Sign in user (JWT)
export const signIn = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return next({ message: "Email and password required!" });

    let parameter = {};
    let sql = `select user_id, firstname, lastname, role, password, email from users Where email = '${email
      .toString()
      .toLowerCase()}'`;
    //@ts-ignore
    let query = db.query(
      sql,
      async (error: MysqlError, results: any, fields: FieldInfo[]) => {
        if (error) return next(error);
        if (results.length !== 1)
          return next({ message: "Please check your email or password!" });

        const isValidPassword = await bcrypt.compare(
          password,
          results[0].password
        );

        if (!isValidPassword)
          return next({ message: "Please check your username or password!" });

        const currentUser: IUser = {
          user_id: results[0].user_id,
          email: results[0].email,
          firstname: results[0].firstname,
          lastname: results[0].lastname,
          role: results[0].role,
        };


        //@ts-ignore
       // const token  = jwt.sign(currentUser, process.env.JWT_SECRET, {expiresIn: jwt_expiration});
        const token = generateToken(currentUser, process.env.JWT_SECRET, jwt_expiration)
        //res.status(200).setHeader("x-auth", token);
        res.status(200).json(token);
        next();
      }
    );
  } catch (e) {
    next(e);
  }
};

// Refresh Token
export const refreshToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {};

// Sign up and login after
export const signUp = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { firstname, lastname, email, password, repeat_password } = req.body;

  try {
    const emailRegex = regexLib.emailRegex;
    const phoneRegex = regexLib.phoneRegex;
    const passwordRegex = regexLib.passwordValidationRegex;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !repeat_password ||
      !passwordRegex.test(password) ||
      !emailRegex.test(email)
    ) {
      return next({
        message: "Please field out all your form fields!",
        errorField: {
          firstname: !firstname ? "firstname required!" : "",
          lastname: !lastname ? "lastname required!" : "",
          email: !email
            ? "email required!"
            : "" || !emailRegex.test(email)
            ? "Invalid email address!"
            : "",
          password: !password
            ? "password required!"
            : "" || !passwordRegex.test(password)
            ? "Invalid password! at least 1 Uppercase letter, 1 lowercase letter and 1 digit"
            : "" || password.toString().length < 8
            ? "Password too short! must be at least 8 characters"
            : "",
          repeat_password: !repeat_password ? "repeat password required!" : "",
        },
      });
    }

    if (password !== repeat_password)
      return next({ message: "Entered passwords  don't much!" });

    const sql2 = `SELECT * FROM users WHERE email = '${email
      .toString()
      .toLowerCase()}'`;

    let qr = db.query(
      sql2,
      async (
        err: MysqlError,
        results: any,
        fields: FieldInfo[] | undefined
      ) => {
        if (err) return next(err);
        if (results.length != 0)
          return next({ message: "Email already taken" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = `insert into users (firstname, lastname, email, password) values ('${firstname
          .toString()
          .toLowerCase()}',
                        '${lastname.toString().toLowerCase()}',
                        '${email.toString().toLowerCase()}',
                        '${hashedPassword}')`;

        db.query(
          sql,
          (error: MysqlError, results: any, fields: FieldInfo | undefined) => {
            if (error) return next(error);
            res
              .status(200)
              .json({ message: "You have been signed up successfully" });
            next();
          }
        );
      }
    );
  } catch (e) {
    return next(e);
  }
};

// verifying whether the user is valid or not
export const verifyUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const headerToken = req.header("Authorization");
    // check whether there is a registered token or not
    if (!headerToken) return next({ message: "You are not logged in!!" });
    // verifying the token validity
    // @ts-ignore
    const token = await jwt.verify(headerToken, process.env.JWT_SECRET);
    // In case the token is invalid
    if (!token) return res.status(403).json({ message: "Invalid token provided!" });

    const jwtDecoded = await jwt.decode(headerToken);
    console.log(jwtDecoded);

    // @ts-ignore
    const sql = `select user_id, role, email, firstname, lastname from users where user_id='${jwtDecoded.user_id}'`;

    db.query(
      sql,
      (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
        if (error) return next(error);
        // if the user doesn't exist
        if (results.length !== 1) return next({
            message: "The user associated with this token no longer exists",
          });
        // @ts-ignore
        req.user = token;
        return next();
      }
    );
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).json({ message: "Invalid token provided!" });
    }
    return next(e);
  }
};

// Check whether the actual user role is allowed or not
export const checkRole = ([...roles]) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // @ts-ignore
    try {
      // @ts-ignore
      const result: number = roles.filter(
        //@ts-ignore
        (item) => req.user.role === item
      ).length;
      result < 1
        ? next({ message: "Not authorized to access this page!" })
        : next();
    } catch (e) {
      return next(e);
    }
  };
};
