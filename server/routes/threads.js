
// ─────────────────────────────────────────────────────────────
// routes/threads.js
//
// These four handlers STILL use an in-memory array — restart the server and
// every thread is gone. Prisma is already connected (see server.js and
// prisma/client.js). YOUR TASK: replace each handler with a real Prisma query.
//
// Rules for every route:
//   • make the handler  async  and  await  the Prisma call
//   • wrap the body in  try/catch  and call  next(error)  on failure
//   • in write routes, convert the id:  parseInt(req.params.id)
//   • for create/update, pass an explicit  data  object — never  data: req.body
//
// When you are done, NO handler should reference the `threads` array below.
// ─────────────────────────────────────────────────────────────
import { Router } from "express";
import prisma from "../prisma/client.js"; // the singleton — already imported for you

const router = Router();

// ⚠️ Delete this in-memory store once all four routes use Prisma.
// We no longer need nextId or the threads array because
// PostgreSQL + Prisma will store and generate the data.
 
// GET /api/threads — return the whole list.
// TODO: replace with  await prisma.thread.findMany()
router.get("/", async (req, res, next) => {
  try {
    // Get all Thread rows from the PostgreSQL database.
    const threads = await prisma.thread.findMany();

    // Send the database rows back as JSON.
    res.json(threads);
  } catch (error) {
    // Pass database errors to Express error handling.
    next(error);
  }
});

// POST /api/threads — create a thread from { title, body }.
// TODO: replace with  await prisma.thread.create({ data: { title, body } })  → 201
router.post("/", async (req, res, next) => {
  try {
    // Get only the fields that we want the client to provide.
    const { title, body = "" } = req.body || {};

    // Create a new Thread row in PostgreSQL.
    // The database generates the id and createdAt automatically.
    const thread = await prisma.thread.create({
      data: {
        title: title,
        body: body,
      },
    });

    // 201 = resource successfully created.
    res.status(201).json(thread);
  } catch (error) {
    // Pass database errors to Express error handling.
    next(error);
  }
});

// PUT /api/threads/:id — update title/body of one thread.
// TODO: replace with  await prisma.thread.update({ where: { id: parseInt(...) }, data })
router.put("/:id", async (req, res, next) => {
  try {
    // req.params.id comes from the URL as a STRING.
    // parseInt converts it to a NUMBER so it matches Prisma's Int id.
    const id = parseInt(req.params.id);

    // Get only the fields that we want to update.
    const { title, body } = req.body || {};

    // Update the Thread row with the matching id.
    const thread = await prisma.thread.update({
      // where identifies the exact row to update.
      where: {
        id: id,
      },

      // data contains the fields that should be changed.
      data: {
        title: title,
        body: body,
      },
    });

    // Return the updated thread.
    res.status(200).json(thread);
  } catch (error) {
    // If the thread does not exist or another DB error occurs,
    // forward the error to Express.
    next(error);
  }
});

// DELETE /api/threads/:id — remove one thread.
// TODO: replace with  await prisma.thread.delete({ where: { id: parseInt(...) } })
//       return 200 with the deleted record (this course's convention).
router.delete("/:id", async (req, res, next) => {
  try {
    // req.params.id is a string, so convert it to an integer.
    const id = parseInt(req.params.id);

    // Delete the Thread row with the matching id.
    // Prisma returns the deleted record.
    const deleted = await prisma.thread.delete({
      where: {
        id: id,
      },
    });

    // This assignment uses 200 + the deleted record.
    res.status(200).json(deleted);
  } catch (error) {
    // Pass database errors to Express error handling.
    next(error);
  }
});

export default router;

