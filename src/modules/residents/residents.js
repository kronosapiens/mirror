const { db, errorLogger } = require('../../db');

exports.addResident = async function (slackId, email = undefined) {
  return db('resident')
    .insert({ slack_id: slackId, email: email })
    .onConflict('slack_id').ignore()
    .returning('id')
    .catch(errorLogger);
};

exports.getResidents = async function () {
  return db('resident')
    .select('*')
    .catch(errorLogger);
};
