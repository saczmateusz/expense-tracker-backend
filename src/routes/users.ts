import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user";
import { v4 as uuidv4 } from "uuid";

const router = Router();
let users: User[] = [];

const userValidationRules = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").notEmpty().withMessage("E-mail is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/", userValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const user: User = {
    id: uuidv4(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };

  users.push(user);
  res.status(201).json(user);
});

router.put("/:id", userValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    res.status(404).send("User not found");
  } else {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;

    res.json(user);
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  const index = users.findIndex((u) => u.id === req.params.id);

  if (index === -1) {
    res.status(404).send("User not found");
  } else {
    users.splice(index, 1);
    res.status(204).send();
  }
});

router.get("/", (req: Request, res: Response) => {
  res.json(users);
});

router.get("/:id", (req: Request, res: Response) => {
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    res.status(404).send("User not found");
  } else {
    res.json(user);
  }
});

export default router;
