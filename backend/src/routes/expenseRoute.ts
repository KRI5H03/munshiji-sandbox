import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  console.log(req.body);
  console.log("return all expense route");
  res.status(200).json({ message: "return all the expenses" });
});

router.post("/", async (req, res) => {
  console.log(req.body);
  console.log("post a new expense");
  res.status(200).json({ message: "create a new expense" });
});

router.put("/:id", async (req, res) => {
  console.log(req.body);
  console.log("edit a expense");
  res.status(200).json({ message: "edited a expense" });
});

router.delete("/:id", async (req, res) => {
  console.log(req.body);
  console.log("deleted a expense");
  res.status(200).json({ message: "deleted a expense" });
});

export default router;
