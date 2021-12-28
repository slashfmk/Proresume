import express from "express";
import { FieldInfo, MysqlError } from "mysql";

const db = require("../database/db_config");
const regexLib = require("../util/regexLibrary");

// TODO create resume
export const createResume = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { title, description, date } = req.body;

  if (!title || !description) return next("Please fill out all fields!!");

  //@ts-ignore
  const sqlInsert = `insert into resumes (title, description, user_id) values ('${title}', '${description}', '${req.user.user_id}')`;
  //@ts-ignore
  const sqlCheckExists = `select * from resumes where title = '${title}' and user_id ='${req.user.user_id}'`;

  db.query(
    sqlCheckExists,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      console.log(results);
      if (results.length !== 0)
        return next({ message: `Resume ${title} already exists!` });

      db.query(sqlInsert, (err: MysqlError) => {
        if (error) return next(err);
        res.status(200).json({ message: `${title} has been added!` });
        next();
      });
    }
  );
};

// TODO: get all resumes
export const getAllResume = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //@ts-ignore
  const sql = `select * from resumes where user_id='${req.user.user_id}'`;

  db.query(
    sql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      res.status(200).json(results);
      next();
    }
  );
};

// TODO: get specific resumes by id
export const getSpecificResume = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const resumeId = req.params.id;

  if (!resumeId) return next("Resume id is missing");
  //@ts-ignore
  const sql = `select * from resumes where resume_id = '${resumeId}' and user_id='${req.user.user_id}'`;

  db.query(
    sql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      res.status(200).json(results);
      next();
    }
  );
};

// TODO: delete resume
export const deleteResume = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const resumeId = req.params.id;

  if (!resumeId) return next("Resume id is missing");

  //@ts-ignore
  const deleteSql = `delete from resumes where resume_id = '${resumeId}' and user_id='${req.user.user_id}'`;
  //@ts-ignore
  const checkExistSql = `select resume_id from resumes where resume_id = ${resumeId} and user_id='${req.user.user_id}'`;

  db.query(
    checkExistSql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      if (results.length === 0)
        return next("There is no such resume for this user to delete!");

      db.query(
        deleteSql,
        (err: MysqlError, result: any, fields: FieldInfo[]) => {
          if (err) return next(err);
          res.status(200).json({ message: `resume has been deleted!` });
          next();
        }
      );
    }
  );
};

//TODO: Edit resume
