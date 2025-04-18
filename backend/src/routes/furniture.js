const express = require('express');
const router = express.Router();
// const furnitureController = require('../controllers/furnitureController'); // Uncomment when controller is implemented
// const authMiddleware = require('../middleware/authMiddleware'); // To protect routes

// Placeholder routes
router.get('/', (req, res) => res.status(501).send('Get Furniture List Not Implemented'));
router.get('/:id', (req, res) => res.status(501).send(`Get Furniture Item ${req.params.id} Not Implemented`));
router.post('/', (req, res) => res.status(501).send('Create Furniture Item Not Implemented')); // Needs auth
router.put('/:id', (req, res) => res.status(501).send(`Update Furniture Item ${req.params.id} Not Implemented`)); // Needs auth
router.delete('/:id', (req, res) => res.status(501).send(`Delete Furniture Item ${req.params.id} Not Implemented`)); // Needs auth

// Example protected routes (uncomment later)
// router.get('/', furnitureController.getAllFurniture); // Public? Or user-specific?
// router.get('/:id', furnitureController.getFurnitureById); // Public?
// router.post('/', authMiddleware, furnitureController.createFurniture);
// router.put('/:id', authMiddleware, furnitureController.updateFurniture);
// router.delete('/:id', authMiddleware, furnitureController.deleteFurniture);

module.exports = router;
