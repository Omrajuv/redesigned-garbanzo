const { promise } = require('protractor');
var mongodb = require('./MongodDbUtil');

function create(record){
    return new Promise((resolve, reject) => {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
        coll.insert(record, function (err, result) {
            if (!err) {
                resolve(result.ops[0]);
            } else {
                reject(err);
            }
        });
    })
}

function createMany(records) {
    return new Promise((resolve, reject) => {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
        coll.insertMany(records, function (err, result) {
            if (!err) {
                resolve(result.ops[0]);
            } else {
                reject(err);
            }
        });
    })
}

function getAll() {
    return new Promise((resolve, reject) => {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
        coll.find({}).toArray(function (err, result) {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    })
}

function getById(id) {
    return new Promise((resolve, reject) => {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
        coll.findOne({ _id: mongodb.ObjectID(id) }, function (err, result) {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    })
}

function getByQuery(query, projection) {
    return new Promise ((resolve, reject) =>{
        if (typeof projection == "function") {
            projection = null;
        }
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
    
        var cursor;
        if (projection) {
            var projectionObj = {};
            projection.forEach(function (p) {
                projectionObj[p] = 1;
            });
            cursor = coll.find(query, projectionObj);
        } else {
            cursor = coll.find(query);
        }
    
        cursor.toArray(function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        });
    })

}

function getAndSortByQuery(query, projection, sortCriteria) {
    return new Promise((resolve, reject) => {
        if (typeof projection == "function") {
            projection = null;
        }
        if (typeof sortCriteria == "function") {
            sortCriteria = null;
        }
    
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
    
        var cursor;
        if (projection) {
            var projectionObj = {};
            projection.forEach(function (p) {
                projectionObj[p] = 1;
            });
            cursor = coll.find(query, projectionObj);
        } else {
            cursor = coll.find(query);
    
        }
    
        if (sortCriteria) {
            cursor.sort(sortCriteria);
        }
    
        cursor.toArray(function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        });
    
    });
}

function update(query, detailsToUpdate) {
    return new Promise ((resolve, reject) =>{
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
        coll.update(query, { $set: detailsToUpdate }, { multi: false }, function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        });
    });
}

function upsert(query, detailsToUpdate) {
    return new Promise ((resolve, reject) => {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
        coll.update(query, { $set: detailsToUpdate }, { multi: false, upsert: true }, function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        });
    });
}


function updateToUnset(query, detailsToUpdate) {
    return new Promise ((resolve, reject) => {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
        coll.update(query, { $unset: detailsToUpdate }, { multi: false }, function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        });
    })

}

function updateArrayById(id, elementsToPush) {
    return new Promise((resolve, reject)=> {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
    
        coll.update({ _id: mongodb.ObjectID(id) }, { $push: elementsToPush }, { multi: false }, function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        });
    })
}


function updateArrayByQuery(query, elementsToPush) {
    return new Promise((resolve, reject)=> {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
    
        coll.update(query, { $push: elementsToPush }, { multi: false }, function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        });
    });
}

function removeItemInArrayByQuery(query, elementToDelete) {
    return new Promise((resolve, reject)=>{
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
    
        coll.update(query, { $pull: elementToDelete }, { multi: false }, function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        });
    })
}

function updateById(id, detailsToUpdate) {
    return new Promise ((resolve, reject)=>{
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
    
        var deletedId;
        if (detailsToUpdate._id) {
            deletedId = detailsToUpdate._id;
            delete detailsToUpdate._id;
        }
    
        coll.update({ _id: mongodb.ObjectID(id) }, { $set: detailsToUpdate }, { multi: false }, function (err, result) {
            if (deletedId) {
                detailsToUpdate._id = deletedId;
            }
    
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    })
}

function updateMany(query, detailsToUpdate) {
    return new promise((resolve, reject) => {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
        coll.updateMany(query, { $set: detailsToUpdate }, function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        });
    });
}

function distinctByQuery(field, query) {
    return new Promise((resolve, reject) => {
        if (typeof query == "function") {
            query = null;
        }
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
        if (!query)
            query = {};
        coll.distinct(field, query, function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        })
    })

}

function remove(id) {
    return new Promise((resolve, reject) => {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
        coll.remove({ _id: mongodb.ObjectID(id) }, function (err, result) {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    });
}

function removeByQuery(query) {
    return new Promise((resolve, reject) => {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());
        coll.remove(query, function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        });

    });
}

function getIdFilter(entity) {
    return {_id: mongodb.ObjectID(entity._id)};
}

function removeItemInArrayById(id, elementToDelete) {
    return new Promise((resolve, reject) => {
        var db = mongodb.getDb();
        var coll = db.collection(this.getCollectionName());

        coll.update({ _id: mongodb.ObjectID(id) }, { $pull: elementToDelete }, { multi: false }, function (err, result) {
            if (!err) {
                resolve(null, result);
            } else {
                reject(err, null);
            }
        });
    })

}

function getMongoDb() {
    return mongodb;
}

function bulkWrite(bulk) {
    return new Promise((resolve, reject)=>{
        var db = mongodb.getDb();

    var coll = db.collection(this.getCollectionName());

    coll.bulkWrite(bulk, function (err, result) {
        if (!err) {
            resolve(null, result);
        } else {
            reject(err, null);
        }
    });
    });
}

function getDb() {
    return monogdb.getDb();
}

module.exports = function BaseDao(collectionName) {
    return {
        create: create,
        createMany: createMany,
        getAll: getAll,
        getById: getById,
        getByQuery: getByQuery,
        getAndSortByQuery: getAndSortByQuery,
        update: update,
        upsert: upsert,
        updateById: updateById,
        updateMany: updateMany,
        updateToUnset: updateToUnset,
        updateArrayById: updateArrayById,
        updateArrayByQuery: updateArrayByQuery,
        removeItemInArrayByQuery: removeItemInArrayByQuery,
        distinctByQuery : distinctByQuery,
        remove: remove,
        removeByQuery: removeByQuery,
        removeItemInArrayById: removeItemInArrayById,
        bulkWrite: bulkWrite,
        getIdFilter: getIdFilter,
        getDb: getDb,
        getCollectionName: function () {
            return collectionName;
        },
    };
};