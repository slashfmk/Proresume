import express from "express";
import bcrypt from "bcrypt";

import { FieldInfo, MysqlError } from "mysql";

const db = require("../database/db_config");
const regexLib = require("../util/regexLibrary");

export const getUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //@ts-ignore
  let sql = `select user_id, firstname, lastname, email, is_active, role, password from users where user_id=${req.user.user_id}`;

  db.query(sql, (error: MysqlError, results: any, fields: FieldInfo[]) => {
    if (error) return next(error.message);
    res.status(200).json(results[0]);
  });
};

export const getUserById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.params.id) return next("Please send a valid id, this one is empty");

  let sql = `select user_id, firstname, lastname, email, is_active, role from users where user_id=${req.params.id}`;

  db.query(sql, (error: Error, results: any, fields: FieldInfo[]) => {
    if (error) return next(error.message);
    if (results.length !== 1)
      return next("id non associate to any user, please send a valid id!");

    console.log(results[0]);
    res.status(200).json(results[0]);
  });
};

export const getAllUsers = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let sql = `select user_id, firstname, lastname, email, is_active, role from users`;

  db.query(sql, (error: Error, results: any, fields: FieldInfo[]) => {
    if (error) return next(error.message);
    console.log(results[0]);
    res.status(200).json(results);
  });
};

export const editUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { firstname, lastname, email, password, repeat_password } = req.body;

  try {
    const emailRegex = regexLib.emailRegex;
    const phoneRegex = regexLib.phoneRegex;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !repeat_password ||
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
            : "" || !regexLib.passwordValidationRegex.test(password)
            ? "Invalid password! at least 1 uppercase letter, 1 lowercase letter and 1 digit"
            : "" || password.toString().length < 8
            ? "Password too short! must be at least 8 characters"
            : "",
          repeat_password: !repeat_password ? "repeat password required!" : "",
        },
      });
    }

    if (password !== repeat_password)
      return next("Passwords entered don't much!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //@ts-ignore
    let sql = `update users set firstname=${firstname}, lastname=${lastname}, email=${email}, password=${hashedPassword} where user_id=${req.user.user_id}`;

    await db.query(sql, (error: Error, results: any, fields: FieldInfo[]) => {
      if (error) return next(error.message);
      res.status(200).json("update made successfully!");
      return next();
    });
  } catch (e) {
    return next(e);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const sql = `select * from users where user_id = ${req.params.id}`;

  db.query(sql, (error: MysqlError, results: any, fields: FieldInfo[]) => {
    if (error) next(error);
    if (results.length <= 0) return next("No user has been assigned this id");
  });

  db.query(
    `delete from users where user_id = ${req.params.id}`,
    (error: Error, results: any, fields: FieldInfo[]) => {
      if (error) return next(error);
      res
        .status(200)
        .json({ message: `user ${req.params.id} successfully deleted!` });
      return next();
    }
  );
};
