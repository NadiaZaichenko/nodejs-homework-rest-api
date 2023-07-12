
const Joi = require("joi");

const addShema = Joi.object({
     name: Joi.string()
     .min(4)
     .max(30)
     .required()
     .messages({ "any.required": "missing required fields" }),
     email: Joi.string()
     .email()
     .required()
     .messages({"any.required" : "missing required fields"}),
     phone: Joi.string() .pattern(
        /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/,
        { name: "numbers" }
      )
      .required()
      .messages({ "any.required": "missing required fields" }),
})

module.exports = {
    addShema,
}