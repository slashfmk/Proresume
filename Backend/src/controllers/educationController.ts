import express from "express";

import { FieldInfo, MysqlError } from "mysql";

const db = require("../database/db_config");
const regexLib = require("../util/regexLibrary");

// TODO create education
export const createEducation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { title, description, start_date, end_date } = req.body;
  const resumeId = req.params.id;

  if (!resumeId) return next({ message: "Please pass the resume id" });

  if (!title || !description || !start_date || !end_date)
    return next({ message: "Please fill out all fields!!" });

  //@ts-ignore
  const sqlInsert = `insert into educations (title, description, start_date, end_date, resume_id) values ('${title}', '${description}', '${start_date}', '${end_date}', '${resumeId}')`;
  const sqlCheckExistsResume = `select * from resumes where resume_id = '${resumeId}'`;

  db.query(
    sqlCheckExistsResume,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      if (results.length === 0)
        return next({
          message: `You are trying to add to an education field to a non existing resume!`,
        });

      db.query(sqlInsert, (err: MysqlError) => {
        if (error) return next(err);
        res.status(200).json({
          message: `${title} field has been added to resume ${results[0].title}!`,
        });
        next();
      });
    }
  );
};

// TODO: get all education
export const getAllEducation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //@ts-ignore
  const sql = `select educations.education_id, educations.title, educations.description, educations.start_date, educations.end_date, resumes.resume_id from educations inner join resumes using(resume_id) inner join users using(user_id) where  users.user_id='${req.user.user_id}'`;

  db.query(
    sql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      res.status(200).json(results);
      next();
    }
  );
};

// TODO: get all education specific
export const getAllEducationSpecifcResume = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const resumeId = req.params.id;
  if (!resumeId) return next({ message: "Resume id is missing" });
  //@ts-ignore
  const sql = `select educations.education_id, educations.title, educations.description, educations.start_date, educations.end_date, resumes.resume_id from educations inner join resumes using(resume_id) inner join users using(user_id) where educations.resume_id = '${resumeId}' and users.user_id='${req.user.user_id}'`;

  db.query(
    sql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      res.status(200).json(results);
      next();
    }
  );
};

// TODO: get specific education by id
export const getSpecificEducation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const educationId = req.params.id;
  if (!educationId) return next({ message: "Education id is missing" });
  //@ts-ignore
  const sql = `select * from educations where educations.education_id = '${educationId}'`;

  db.query(
    sql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      res.status(200).json(results);
      next();
    }
  );
};

// TODO: delete education
export const deleteEducation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const educationId = req.params.id;
  if (!educationId) return next({ message: "Education id is missing" });

  //@ts-ignore
  const deleteSql = `delete from educations where education_id = '${educationId}'`;
  //@ts-ignore
  const checkExistSql = `select * from educations where education_id = '${educationId}'`;

  db.query(
    checkExistSql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      if (results.length === 0)
        return next({
          message: "There is no such education field for you to delete!",
        });

      db.query(
        deleteSql,
        (err: MysqlError, result: any, fields: FieldInfo[]) => {
          if (err) return next(err);
          res
            .status(200)
            .json({ message: `Education field has been deleted!` });
          next();
        }
      );
    }
  );
};
