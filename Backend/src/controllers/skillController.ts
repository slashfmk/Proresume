import express from "express";

import { FieldInfo, MysqlError } from "mysql";

const db = require("../database/db_config");
const regexLib = require("../util/regexLibrary");

// TODO create skill
export const createSkill = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { title, level } = req.body;
  const resumeId = req.params.id;

  if (!resumeId) return next({ message: "Please pass the resume id" });

  if (!title || !level) return next("Please fill out all fields!!");

  //@ts-ignore
  const sqlInsert = `insert into skills (title, level, resume_id) values ('${title}', '${level}', '${resumeId}')`;
  const sqlCheckExistsResume = `select * from resumes where resume_id = '${resumeId}'`;
  const sqlCheckSkillExists = `select * from skills where title = '${title}'`;

  db.query(
    sqlCheckExistsResume,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      if (results.length === 0)
        return next({
          message: `You are trying to add to a non existing resume!`,
        });

      db.query(
        sqlCheckSkillExists,
        (
          error2: MysqlError,
          results2: any,
          fields: FieldInfo[] | undefined
        ) => {
          if (error2) return next(error2);
          if (results2.length !== 0)
            return next({
              message: `Skill ${title} already exists in ${results[0].title} resume!`,
            });

          db.query(sqlInsert, (err: MysqlError, result: any) => {
            if (error) return next(err);
            res.status(200).json({
              message: `${title} field has been added to resume ${results[0].title}!`,
            });
            next();
          });
        }
      );
    }
  );
};

// TODO: get all create skill
export const getAllSkill = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //@ts-ignore
  const sql = `select skills.skill_id, skills.title, skills.level, resumes.resume_id from skills inner join resumes using(resume_id) inner join users using(user_id) where  users.user_id='${req.user.user_id}'`;

  db.query(
    sql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      res.status(200).json(results);
      next();
    }
  );
};

// TODO: get all create skill
export const getAllSkillSpecifcResume = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const resumeId = req.params.id;
  if (!resumeId) return next("Resume id is missing");
  //@ts-ignore
  const sql = `select skills.skill_id, skills.title, skills.level, resumes.resume_id from skills inner join resumes using(resume_id) inner join users using(user_id) where skills.resume_id = '${resumeId}' and users.user_id='${req.user.user_id}'`;

  db.query(
    sql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      res.status(200).json(results);
      next();
    }
  );
};

// TODO: get specific create skill by id
export const getSpecificSkill = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const skillId = req.params.id;
  if (!skillId) return next("Skills id is missing");
  //@ts-ignore
  const sql = `select * from skills where skills.skill_id = '${skillId}'`;

  db.query(
    sql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      if (results.length === 0)
        return next({
          message: `There is no skill associated with ${skillId}`,
        });
      res.status(200).json(results);
      next();
    }
  );
};

// TODO: delete create skill
export const deleteSkill = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const skillId = req.params.id;
  if (!skillId) return next("Skills id is missing");

  //@ts-ignore
  const deleteSql = `delete from skills where skill_id = '${skillId}'`;
  //@ts-ignore
  const checkExistSql = `select * from skills where skill_id = '${skillId}'`;

  db.query(
    checkExistSql,
    (error: MysqlError, results: any, fields: FieldInfo[] | undefined) => {
      if (error) return next(error);
      if (results.length === 0)
        return next("There is no such skill field for you to delete!");

      db.query(
        deleteSql,
        (err: MysqlError, result: any, fields: FieldInfo[]) => {
          if (err) return next(err);
          res.status(200).json({ message: `Skills field has been deleted!` });
          next();
        }
      );
    }
  );
};
