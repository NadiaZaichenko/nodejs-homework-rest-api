const express = require('express')

const router = express.Router()

const ctrl = require("../../controllers/controllers")

const {validateBody} = require("../../midllewares");

const shema = require("../../shemas/shemaContact")

router.get('/', ctrl.getAll)

router.get('/:contactId',  ctrl.getById)

router.post('/', validateBody(shema.addShema), ctrl.add)

router.put('/:contactId', validateBody(shema.addShema), ctrl.update)

router.delete('/:contactId',ctrl.remove )


module.exports = router
