const express = require('express');
const router = express.Router();
const termsController = require('../controller/termscondition');

router.post('/create', termsController.createTerms);
router.get('/getallterms', termsController.getAllTerms);
router.get('/getbyterms/:id', termsController.getTermsById);
router.put('/updateterms/:id', termsController.updateTerms);
router.delete('/deleteterms/:id', termsController.deleteTerms);
router.get('/getbyclient/:clientId', termsController.getTermsByClientId);

module.exports = router;
