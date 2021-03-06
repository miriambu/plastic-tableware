var express = require('express');
var qs = require('querystring');
var router = express.Router();
router.get('/showAllItems', showAllItems);
router.post('/addItem', addItem);
router.post('/deleteItem', deleteItem);
router.post('/countItem', countItem);
router.post('/changeItem', changeItem);

var Item = require('../models/Item');
var path = require('path');
var counter = 0;
/*
module.exports = {
  showAllItems: showAllItems,
  addItem: addItem,
  checkQuantity: checkQuantity,
  deleteItem: deleteItem,
  deleteAllItems: deleteAllItems,
  a: a
}

}*/
module.exports = router;

function showAllItems(req,res) {    
	Item.find({}, (err, stock) => {
        if (err) {
            res.status(404);
            res.send('Items not found!');
        }
        else{
            res.json(stock);
        }      
        console.log("in showAllItems");
		console.log(stock);
  });
  
}

function addItem(req,res) {
	console.log("get post request in server side");  
    var body = '';
        req.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                req.connection.destroy();
            }
        });   
        req.on('end', function () {
        var POST = qs.parse(body); 
        var newItem = new Item({ category : POST.category,subCategory :  POST.subCategory ,name : POST.name , description : POST.description, location : POST.location, index: counter++ });
        newItem.save();           
        res.send(newItem);
        //showAllItems(req,res);
        });
}

function countItem(req,res) {   
	console.log("get post request in server side");  
    var body = '';
        req.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                req.connection.destroy();
            }
        });   
        req.on('end', function () {
        var POST = qs.parse(body); 
		Item.find({ category : POST.category,name : POST.name}, (err, result) => {
        if (err) {
            res.status(404);
            res.send('Items not found!');
        }
        else{
            res.send(result);
        }      
        console.log("in countItem");
		console.log(result);
		});
		});
  
}

function checkQuantity (req,res){
	Item.$where('this.quantity <= this.minQuantity').exec(function(err, result) {
	if (err) {
	  throw err;
	}
  console.log(result);
  res.json(result);
	});

}

function deleteAllItems(req,res) {
	Item.remove ({},function(err, result) {
	if (err) {
	  throw err;
	}
	console.log(result);
	res.json(result);
	});
}

function deleteItem(req,res) {
	console.log("get post request in server side");  
    var body = '';
        req.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                req.connection.destroy();
            }
        });   
        req.on('end', function () {
        var POST = qs.parse(body); 
        Item.remove({ category:POST.category , name:POST.name},function(err, result) {
		if (err) {
			throw err;
		}
		res.send("success");
		//;
        });
		});
};

function changeItem(req,res) {
	console.log("in changeItem");
	var body = '';
        req.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                req.connection.destroy();
            }
        });   
        req.on('end', function () {
        var POST = qs.parse(body);
		Item.findOneAndUpdate({index : POST.index }, {$set: {category : POST.category,subCategory :  POST.subCategory , description : POST.description, location : POST.location, name : POST.name }}, function(err, doc){
		if(err){
            throw err;
        }
        console.log("thid is the doc variable: "+doc);
		console.log("updated");
		//res.json("Item");
    });
	});
}


/*function changeItem(res,item,key,value) {
	console.log("in changeItem");
    Item.findOneAndUpdate({index: item.index}, {$set: {category: value}}, function(err, doc){
        if(err){
            throw err;
        }
        console.log(doc);
		console.log("הפריט עודכן");
		res.json("הפריט עודכן");
    });

}

function a(req,res) {
	console.log("in a");
	var item = new Item({ category: 'aaaa',subCategory: 'sss' ,index:'1' ,name:'www' ,description: 'this is item a',quantity:4,minQuantity:2 });
	item.save();
	changeCategoryOfItem(req,res,item)
}

function changeCategoryOfItem(req,res,item) {
	console.log("in changeCategoryOfItem");
	var key = 'category';
	var value = "mmmmmm"
	//var value = item.params.category;
	changeItem(res,item,key,value);
}

*/



