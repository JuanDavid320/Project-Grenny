const express= require('express');
const router= express.Router();
const customerController =require('../controllers/adminController')

router.get('/admin', customerController.render);
router.get('/dashboardA', customerController.renderD)
router.post('/joinA', customerController.join);
router.get('/listA', customerController.list);
router.post('/addA',customerController.save);
router.get('/deleteA/:id', customerController.delete);
router.get('/updateA/:id', customerController.edit);
router.post('/updateA/:id', customerController.update);



module.exports= router;
