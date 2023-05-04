const express = require("express");
const auth = require("../../auth/auth");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  changeFavoriteStatus,
} = require("../../controllers/contacts");
const router = express.Router();
router.get("/", auth, async (req, res) => {
  try {
    const { code, message } = await listContacts(req.body.user, req.query);
    res.status(code).json(message);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.get("/:contactId", auth, async (req, res) => {
  try {
    const { code, message } = await getContactById(req.params.contactId);
    res.status(code).json(message);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.patch("/:id/favorite", auth, async (req, res) => {
  try {
    const { code, message } = await changeFavoriteStatus(
      req.params.id,
      req.body
    );
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { code, message } = await addContact(req.body);
    console.log(message);

    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:contactId", auth, async (req, res) => {
  try {
    const { code, message } = await removeContact(
      req.params.contactId,
      req.body.user
    );
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:contactId", auth, async (req, res) => {
  try {
    const { message, code } = await updateContact(
      req.params.contactId,
      req.body
    );
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
