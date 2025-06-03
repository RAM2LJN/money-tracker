import express from 'express';
import { body, validationResult } from 'express-validator';

import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ timestamp: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth,
  body('amount').isNumeric(),
  body('type').isIn(['income', 'expense']),
  body('category').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const transaction = new Transaction({ ...req.body, userId: req.user.id });
      await transaction.save();
      res.json(transaction);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const t = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!t) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
