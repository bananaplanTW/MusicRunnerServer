var MongoDB = require('mongodb'),
	MongoClient = MongoDB.MongoClient,
	errorLog = require('../lib/logger').errorLog;
var url = "mongodb://bananaplan:Sunflower123@db.bitnamiapp.com:27017/runningarea";
var DB;

MongoClient.connect(url, function (error, db) {
	if (error) {
		errorLog.error("[models/ModelMongoDB.js]: errors when connecting to mongodb", error);
		return;
	}
	errorLog.info("mongodb connected");
	DB = db;
});

function getCollection(collectionName, options, callback) {
	DB.collection(collectionName, options, function (error, collection) {
		if (error) {
			errorLog.error("[models/ModelMongoDB.js]: errors when getting collection", error);
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
			errorLog.error("[models/ModelMongoDB.js]: errors when connecting to mongodb", error);
			callback(error, null);
			return;
		}
		collection.insert(insertData, function (error, data) {
			if (error) {
				errorLog.error("[models/ModelMongoDB.js]: errors when inserting to mongodb", error);
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
			errorLog.error("[models/ModelMongoDB.js]: errors when connecting to mongodb", error);
			callback(error, null);
			return;
		}
		collection.find(queryObject, queryOptions).toArray(function (error, data){
			if (error) {
				errorLog.error("[models/ModelMongoDB.js]: errors when getting to mongodb", error);
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
			errorLog.error("[models/ModelMongoDB.js]: errors when connecting to mongodb", error);
			callback(error, null);
			return;
		}
		collection.find(queryObject, queryOptions).count(function (error, data){
			if (error) {
				errorLog.error("[models/ModelMongoDB.js]: errors when checking to mongodb", error);
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