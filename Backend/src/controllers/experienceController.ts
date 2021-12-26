import express from "express";

import { FieldInfo, MysqlError } from "mysql";

const db = require("../database/db_config");
const regexLib = require("../util/regexLibrary");

// TODO create experience
export const createExperience = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { title, description, start_date, end_date } = req.body;
  const resumeId = req.params.id;

  if (!resumeId) return next({ message: "Please pass the resume id" });

  if (!title || !description || !start_date || !end_date)
    return next("Please fill out all fields!!");

  //@ts-ignore
  const sqlInsert = `insert into experiences (title, description, start_date, end_date, resume_id) values ('${title}', '${description}', '${start_date}', '${end_date}', '${resumeId}')`;
  const sqlCheckExistsExperience = `select * from resumes where resume_id = '${resumeId}'`;

  db.query(
    sqlCheckExistsExperience,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      if (results.length === 0)
        return next({
          message: `You are trying to add an experiment field to a non existing resume!`,
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

// TODO: get all experience
export const getAllExperience = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //@ts-ignore
  const sql = `select experiences.experience_id, experiences.title, experiences.description, experiences.start_date, experiences.end_date, resumes.resume_id from experiences inner join resumes using(resume_id) inner join users using(user_id) where  users.user_id='${req.user.user_id}'`;

  db.query(
    sql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      res.status(200).json(results);
      next();
    }
  );
};

// TODO: get all experience
export const getAllExperienceSpecifcResume = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const resumeId = req.params.id;
  if (!resumeId) return next("Resume id is missing");
  //@ts-ignore
  const sql = `select experiences.experience_id, experiences.title, experiences.description, experiences.start_date, experiences.end_date, resumes.resume_id from experiences inner join resumes using(resume_id) inner join users using(user_id) where experiences.resume_id = '${resumeId}' and users.user_id='${req.user.user_id}'`;

  db.query(
    sql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      res.status(200).json(results);
      next();
    }
  );
};

// TODO: get specific experience by id
export const getSpecificExperience = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const experienceId = req.params.id;
  if (!experienceId) return next("Experience id is missing");
  //@ts-ignore
  const sql = `select * from experiences where experiences.experience_id = '${experienceId}'`;

  db.query(
    sql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      res.status(200).json(results);
      next();
    }
  );
};

// TODO: delete experience
export const deleteExperience = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const experienceId = req.params.id;
  if (!experienceId) return next("Experience id is missing");

  //@ts-ignore
  const deleteSql = `delete from experiences where experience_id = '${experienceId}'`;
  //@ts-ignore
  const checkExistSql = `select * from experiences where experience_id = '${experienceId}'`;

  db.query(
    checkExistSql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      if (results.length === 0)
        return next("There is no such experience field for you to delete!");

      db.query(
        deleteSql,
        (err: MysqlError, result: any, fields: FieldInfo[]) => {
          if (err) return next(err);
          res
            .status(200)
            .json({ message: `Experience field has been deleted!` });
          next();
        }
      );
    }
  );
};
