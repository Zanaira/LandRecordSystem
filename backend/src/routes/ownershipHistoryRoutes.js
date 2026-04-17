import express from 'express';
import {
    createOwnershipHistory,
    getAllOwnershipHistories,
    getOwnershipHistoryById,
    updateOwnershipHistory,
    deleteOwnershipHistory,
    getOwnershipHistoryByLandId
} from '../controllers/ownershipHistoryController.js';
import { protect } from "../sevices/authmiddleware.js";

const router = express.Router();

router.post("/:landId",protect, createOwnershipHistory);
router.get('/', getAllOwnershipHistories);
router.get('/:id', getOwnershipHistoryById);
router.get('/land/:landId', getOwnershipHistoryByLandId);
router.put('/:id', updateOwnershipHistory);
router.delete('/:id', deleteOwnershipHistory);

export default router;
