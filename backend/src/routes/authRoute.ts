import { Router } from "express";

const router = Router();

router.post("/login", async (req, res) => {
  console.log(req.body);
  console.log("login route");
  res.status(200).json({ message: "login route works fine" });
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  console.log("register route");
  res.status(200).json({ message: "register route works fine" });
});

export default router;
