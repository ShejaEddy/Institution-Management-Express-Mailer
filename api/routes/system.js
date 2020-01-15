const express = require('express');
const router = express.Router();


 const handler = require('../controllers/index.js');
  
 router.post('/school',handler.addschool)
 router.post('/company',handler.addCompany)   
 router.get('/school',handler.school);
 router.get('/company',handler.Company);

 module.exports = router