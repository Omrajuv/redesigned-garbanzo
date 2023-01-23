const { response } = require('express');
const { promise } = require('protractor');
var userDao = require('../daos/userDao');

function getAllUserDetails(data) {
    return new Promise((resolve, reject) => {
        userDao.getAll(data).then((response) => {
            resolve(response)
        }).catch((err)=>{
            reject(err)
        })
    })
}

function addUser(data) {
    return new Promise((resolve, reject)=>{
        userDao.create(data).then((response)=>{
            resolve(response)
        }).catch((err)=>{
            reject(err)
        })      
    })
}


function update(data) {
    return new promise((resolve, reject) =>{
        userDao.updateById(id, data).then((response)=>{
            resolve(response)
        }).catch((err)=>{
            reject(err)
        })
    })
}

function remove(id) {
    return new Promise((resolve, reject) => {
        userDao.remove(id).then((response)=>{
            resolve(response)
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports.getAllUserDetails = getAllUserDetails;
module.exports.addUser = addUser;
module.exports.update = update;
module.exports.remove = remove;