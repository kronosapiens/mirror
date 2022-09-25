const { db } = require('../db');

// Houses

exports.updateHouse = async function (houseData) {
  return db('House')
    .insert(houseData)
    .onConflict('slackId').merge();
};

exports.getHouse = async function (houseId) {
  return db('House')
    .where({ slackId: houseId })
    .select('*')
    .first();
};

exports.getNumHouses = async function () {
  return db('House')
    .count('id')
    .first();
};

exports.setChoreClaimsChannel = async function (houseId, channelId) {
  return db('House')
    .where({ slackId: houseId })
    .update({ choresChannel: channelId });
};

// Residents

exports.addResident = async function (houseId, slackId) {
  return db('Resident')
    .insert({ houseId: houseId, slackId: slackId, active: true })
    .onConflict('slackId').merge();
};

exports.deleteResident = async function (slackId) {
  return db('Resident')
    .where({ slackId })
    .update({ active: false });
};

exports.getResidents = async function (houseId) {
  return db('Resident')
    .select('*')
    .where({ houseId })
    .where('active', true);
};
