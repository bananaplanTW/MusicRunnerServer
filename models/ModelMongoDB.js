var MongoDB = require('mongodb'),
	MongoClient = MongoDB.MongoClient;
var url = "mongodb://bananaplan:Sunflower123@db.bitnamiapp.com:27017/runningarea";
var DB;

MongoClient.connect(url, function (error, db) {
	if (error) {
		console.log(error);
		return;
	}
	console.log("mongodb connected");
	DB = db;
});

function getCollection(collectionName, options, callback) {
	DB.collection(collectionName, options, function (error, collection) {
		if (error) {
			console.log(error);
			callback(error, null);
			return;
		}
		callback(null, collection);
	})
};

function insert(collectionName, insertData, callback) {
	var options = {};
	getCollection(collectionName, options, function (error, collection) {
		if (error) {
			console.log(error);
			callback(error, null);
			return;
		}
		collection.insert(insertData, function (error, data) {
			if (error) {
				console.log(error);
				callback(error, null);
				return;
			}
			callback(null, data);
		});
	});
};

function get (collectionName, queryObject, queryOptions, collectionOptions, callback) {
	getCollection(collectionName, collectionOptions, function (error, collection) {
		if (error) {
			console.log(error);
			callback(error, null);
			return;
		}
		collection.find(queryObject, queryOptions).toArray(function (error, data){
			if (error) {
				console.log(error);
				callback(error, null);
				return;
			}
			callback(null, data);
		});
	})
};

function isExist (collectionName, queryObject, queryOptions, collectionOptions, callback) {
	getCollection(collectionName, collectionOptions, function (error, collection) {
		if (error) {
			console.log(error);
			callback(error, null);
			return;
		}
		collection.find(queryObject, queryOptions).count(function (error, data){
			if (error) {
				console.log(error);
				callback(error, null);
				return;
			}
			callback(null, data);
		});
	})
};

module.exports = {
	insert : insert,
	get: get,
	isExist: isExist
};