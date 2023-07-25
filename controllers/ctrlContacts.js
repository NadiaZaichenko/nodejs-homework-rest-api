const {Contact} = require("../models/contact");

const {HttpError, ctrlWrapper} = require("../helpers")

const getAll = async (req, res) => {
  const {_id: owner} = req.user;
      const result = await Contact.find({owner});
      res.json(result);
  }

  const getById = async (req, res) => {
    
       const {contactId} = req.params;
       const result = await Contact.findById(contactId);
       if(!result) {
        throw HttpError(404, "Not Found");
       }
       res.json(result);
  }

  const add = async (req, res) => {
      const {_id: owner} = req.user;
      const result = await Contact.create({...req.body}, owner);
      res.status(201).json(result);
  }

  const update = async (req, res) => {
      const {contactId} = req.params;
      const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
      if(!result) {
        throw HttpError(404, "Not Found");
        
       }
       res.json(result);
  }

  const updateFavorite = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if(!result) {
      throw HttpError(404, "Not Found");
      
     }
     res.json(result);
}

  const remove = async (req, res) => {
      const {contactId} = req.params;
      const result = await Contact.findByIdAndDelete(contactId);
      if(!result) {
        throw HttpError(404, "Not Found");
      }
      res.json({
        message: "Delete success",
      })

  }

  module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    update: ctrlWrapper(update),
    updateFavorite: ctrlWrapper(updateFavorite),
    remove: ctrlWrapper(remove),
  }