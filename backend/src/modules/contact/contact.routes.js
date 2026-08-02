import express from 'express'
import { attachDb } from '../../shared/db.js'
import { submitContact } from './contact.controller.js'

const router = express.Router()

router.post('/', attachDb, submitContact)

export default router
