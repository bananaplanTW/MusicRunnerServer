var ModelMongoDB = require("../models/ModelMongoDB");

var ModuleRouteInfo = (function () {
	var intance;
	function getInstance () {
		var modelMongoDB = ModelMongoDB;
		return {
			checkRouteIsExist: function (queryObject, queryOptions, callback) {
				modelMongoDB.isExist("route", queryObject, queryOptions, {}, function (error, data) {
					if (error) {
						console.log(error);
						callback(error, null);
						return;
					}
					callback(null, data);
				});
			},
			getRouteInfo: function (queryObject, queryOptions, callback) {
				modelMongoDB.get("route", queryObject, queryOptions, {}, function (error, data) {
					if (error) {
						console.log(error);
						callback(error, null);
						return;
					}
					callback(null, data);
				});
			},
			insertRouteInfo: function (routeData, callback) {
				modelMongoDB.insert("route", routeData, function (error, data) {
					if (error) {
						console.log(error);
						callback(error, null);
						return;
					}
					callback(null, data);
				});
			}
		}
	}

	return {
		getInstance: function () {
			if (typeof(instance) === 'undefined') {
				instance = getInstance();
			}
			return instance;
		}
	}
})();

module.exports = ModuleRouteInfo;