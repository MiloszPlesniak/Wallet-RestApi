const { Contact } = require("../models/contacts.js");
const {
  postValidate,
  putValidate,
  patchValidate,
} = require("../models/contacts.js");
const contactsPagimation = require("../helpers/contactsPagimation.js");

const listContacts = async (user, query) => {
  let contacts = await Contact.find({ owner: user.id });
  const { limits, page, favorite } = query;

  if (favorite === "true") {
    contacts = contacts.filter((contact) => contact.favorite === true);
  }

  contacts = contactsPagimation(contacts, page || 1, limits || 20);

  console.log(contacts.length);
  return { code: 201, message: contacts };
};

const getContactById = async (contactId) => {
  console.log(contactId, contactId.length);
  if (contactId.length !== 24) {
    return { code: 400, message: "id string is too short" };
  }
  const foundContact = await Contact.findById(contactId);
  if (!foundContact) return { code: 404, message: "Not found" };
  return { code: 201, message: foundContact };
};

const addContact = async (body) => {
  const { error } = postValidate.validate(body.data);
  const { data, user } = body;
  if (error) return { code: 400, message: error.details[0].message };
  try {
    const { name, email, phone } = data;
    const contact = new Contact({ name, email, phone, owner: user.id });
    contact.save();
    return { code: 201, message: contact };
  } catch (error) {
    return { code: 500, message: error };
  }
};

const removeContact = async (contactId) => {
  if (contactId.length !== 24) {
    return { code: 400, message: "id string is too short" };
  }
  try {
    const destructContact = await Contact.findByIdAndDelete(contactId);
    if (!destructContact) return { code: 404, message: "Not found" };
    return {
      code: 200,
      message: {
        message: "contact deleted",
        destructContact: destructContact,
      },
    };
  } catch (error) {
    return { code: 500, message: error };
  }
};

const changeFavoriteStatus = async (contactId, body) => {
  const { message, code } = await getContactById(contactId);
  if (code !== 201) return { code, message };
  const { error } = patchValidate.validate(body.data);
  if (error) return { code: 400, message: error.details[0].message };
  try {
    const changedContact = await Contact.findByIdAndUpdate(
      contactId,
      body.data
    );
    return { code: 201, message: changedContact };
  } catch (error) {
    return { code: 500, message: error };
  }
};

const updateContact = async (contactId, body) => {
  const { error } = putValidate.validate(body.data);
  const { code, message } = await getContactById(contactId);
  if (error) return { code: 400, message: error.details[0].message };
  if (code !== 201) return { code, message };
  try {
    const changedContact = await Contact.findByIdAndUpdate(
      contactId,
      body.data
    );
    return { code: 201, message: changedContact };
  } catch (error) {
    return { code: 500, message: error };
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  changeFavoriteStatus,
  updateContact,
};
