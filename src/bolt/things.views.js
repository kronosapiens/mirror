const voca = require('voca');

const common = require('./common');
const { HOUR } = require('../constants');
const { thingsMinVotesScalar, thingsPollLength } = require('../config');

// Things Views

exports.parseThingAdd = function (text) {
  // [type]-[name]-[quantity]-[value]
  let [ type, name, quantity, value ] = text.split('-');
  type = voca(type).trim().titleCase().value();
  name = voca(name).trim().titleCase().value();
  quantity = voca(quantity).trim().lowerCase().value();
  value = voca(value).trim().value();
  return { type, name, quantity, value };
};

exports.parseThingDel = function (text) {
  // [type]-[name]
  let [ type, name ] = text.split('-');
  type = voca(type).trim().titleCase().value();
  name = voca(name).trim().titleCase().value();
  return { type, name };
};

exports.formatThing = function (thing) {
  return `${thing.type}: ${thing.name} - ${thing.quantity} ($${thing.value})`;
};

exports.thingsHomeView = function (balance) {
  const docsURI = 'https://github.com/kronosapiens/mirror/wiki/Things';
  const textA = `We use *<${docsURI}|Things>* to spend money together.\n\n` +
    'Anyone can propose a buy, which requires *one* thumbs-up vote per $50. ' +
    'Successful buys are fulfilled within 3-7 days.';

  const textB = `The house has *$${balance}* left in the account :moneybag:`;

  return {
    type: 'home',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'Welcome to Things', emoji: true } },
      { type: 'section', text: { type: 'mrkdwn', text: textA } },
      { type: 'divider' },
      { type: 'section', text: { type: 'mrkdwn', text: textB } },
      {
        type: 'actions',
        elements: [
          { type: 'button', action_id: 'things-buy', text: { type: 'plain_text', text: 'Buy a thing', emoji: true } }
        ]
      }
    ]
  };
};

exports.thingsBuyView = function (things) {
  const mappedThings = things.map((thing) => {
    return {
      value: `${thing.id}`,
      text: { type: 'plain_text', text: exports.formatThing(thing), emoji: true }
    };
  });

  const mainText = 'Choose the thing to buy. Make sure you have support for large buys, ' +
    'as you need one thumbs-up vote per $50.';

  return {
    type: 'modal',
    callback_id: 'things-buy-callback',
    title: { type: 'plain_text', text: 'Things', emoji: true },
    submit: { type: 'plain_text', text: 'Buy', emoji: true },
    close: { type: 'plain_text', text: 'Cancel', emoji: true },
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'Buy a thing', emoji: true } },
      { type: 'section', text: { type: 'mrkdwn', text: mainText } },
      {
        type: 'input',
        label: { type: 'plain_text', text: 'Thing to buy', emoji: true },
        element: {
          type: 'static_select',
          action_id: 'options',
          placeholder: { type: 'plain_text', text: 'Choose a thing', emoji: true },
          options: mappedThings
        }
      }
    ]
  };
};

exports.thingsBuyCallbackView = function (buy, thing, priorBalance) {
  const pollQuorum = Math.ceil(thing.value / thingsMinVotesScalar);
  const currentBalance = priorBalance - thing.value;

  const textA = `*<@${buy.boughtBy}>* bought *${thing.name} - ${thing.quantity}* for *$${thing.value}*. ` +
    `There's *$${currentBalance}* left in the house account :fire:`;
  const textB = `*${pollQuorum} endorsement(s)* are required to pass, ` +
    `voting closes in *${thingsPollLength / HOUR} hours*`;

  return [
    { type: 'section', text: { type: 'mrkdwn', text: textA } },
    { type: 'section', text: { type: 'mrkdwn', text: textB } },
    { type: 'actions', elements: common.makeVoteButtons(buy.pollId, 1, 0) }
  ];
};
