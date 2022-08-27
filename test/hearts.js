const { expect } = require('chai');
const chai = require('chai');
const BN = require('bn.js');
const bnChai = require('bn-chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(bnChai(BN));
chai.use(chaiAsPromised);

const { USER1, USER2, USER3, USER4, USER5, NAY, YAY } = require('./../src/constants');

const { db } = require('./../src/db');
const Hearts = require('./../src/modules/hearts/models');
const Polls = require('./../src/modules/polls/models');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Hearts', async () => {

  const POLL_LENGTH = 35;

  afterEach(async () => {
    await db('heart_challenge').del();
    await db('heart').del();
  });

  describe('using hearts', async () => {
    it('can generate hearts for users', async () => {
      await Hearts.generateHearts(USER1, 1);
      await Hearts.generateHearts(USER1, 1);
      await Hearts.generateHearts(USER2, 1);
      await sleep(1);

      const hearts1 = await Hearts.getUserHearts(USER1);
      const hearts2 = await Hearts.getUserHearts(USER2);
      const hearts3 = await Hearts.getUserHearts(USER3);

      expect(hearts1.sum).to.eq.BN(2);
      expect(hearts2.sum).to.eq.BN(1);
      expect(hearts3.sum).to.equal(null)
    });

    it('can aggregate positive and negative hearts', async () => {
      await Hearts.generateHearts(USER1, 2);
      await Hearts.generateHearts(USER1, 1);
      await Hearts.generateHearts(USER1, -2);
      await sleep(1);

      const hearts = await Hearts.getUserHearts(USER1);

      expect(hearts.sum).to.eq.BN(1);
    });

    it('can handle fractional hearts', async () => {
      await Hearts.generateHearts(USER1, 2.5);
      await Hearts.generateHearts(USER1, -.75);
      await sleep(1);

      const hearts = await Hearts.getUserHearts(USER1);

      expect(hearts.sum).to.eq.BN(1.75);
    });

    it('can resolve a challenge where the challenger wins', async () => {
      await Hearts.generateHearts(USER1, 5);
      await Hearts.generateHearts(USER2, 5);

      const [ challenge ] = await Hearts.initiateChallenge(USER1, USER2, 1, POLL_LENGTH);

      await Polls.submitVote(challenge.poll_id, USER1, YAY);
      await Polls.submitVote(challenge.poll_id, USER2, NAY);
      await Polls.submitVote(challenge.poll_id, USER3, YAY);
      await Polls.submitVote(challenge.poll_id, USER4, YAY);
      await Polls.submitVote(challenge.poll_id, USER5, YAY);

      await sleep(POLL_LENGTH);

      await Hearts.resolveChallenge(challenge.id);
      await sleep(1);

      const hearts1 = await Hearts.getUserHearts(USER1);
      const hearts2 = await Hearts.getUserHearts(USER2);
      expect(hearts1.sum).to.eq.BN(5);
      expect(hearts2.sum).to.eq.BN(4);
    });

    it('can resolve a challenge where the challenger loses', async () => {
      await Hearts.generateHearts(USER1, 5);
      await Hearts.generateHearts(USER2, 5);

      const [ challenge ] = await Hearts.initiateChallenge(USER1, USER2, 1, POLL_LENGTH);

      await Polls.submitVote(challenge.poll_id, USER1, YAY);
      await Polls.submitVote(challenge.poll_id, USER2, NAY);
      await Polls.submitVote(challenge.poll_id, USER3, NAY);

      await sleep(POLL_LENGTH);

      await Hearts.resolveChallenge(challenge.id);
      await sleep(1);

      const hearts1 = await Hearts.getUserHearts(USER1);
      const hearts2 = await Hearts.getUserHearts(USER2);
      expect(hearts1.sum).to.eq.BN(4);
      expect(hearts2.sum).to.eq.BN(5);
    });

    it('can resolve a challenge where the quorum is not reached', async () => {
      await Hearts.generateHearts(USER1, 5);
      await Hearts.generateHearts(USER2, 5);

      const [ challenge ] = await Hearts.initiateChallenge(USER1, USER2, 1, POLL_LENGTH);

      await Polls.submitVote(challenge.poll_id, USER1, YAY);
      await Polls.submitVote(challenge.poll_id, USER2, NAY);
      await Polls.submitVote(challenge.poll_id, USER3, YAY);

      await sleep(POLL_LENGTH);

      await Hearts.resolveChallenge(challenge.id);
      await sleep(1);

      const hearts1 = await Hearts.getUserHearts(USER1);
      const hearts2 = await Hearts.getUserHearts(USER2);
      expect(hearts1.sum).to.eq.BN(4);
      expect(hearts2.sum).to.eq.BN(5);
    });

    it('cannot resolve a challenge before the poll is closed', async () => {
      await Hearts.generateHearts(USER1, 5);
      await Hearts.generateHearts(USER2, 5);

      const [ challenge ] = await Hearts.initiateChallenge(USER1, USER2, 1, POLL_LENGTH);

      await Polls.submitVote(challenge.poll_id, USER1, YAY);
      await Polls.submitVote(challenge.poll_id, USER2, NAY);
      await Polls.submitVote(challenge.poll_id, USER3, YAY);
      await sleep(1);

      await expect(Hearts.resolveChallenge(challenge.id))
        .to.be.rejectedWith('Poll not closed!');
    });

    it('cannot resolve a challenge twice', async () => {
      await Hearts.generateHearts(USER1, 5);
      await Hearts.generateHearts(USER2, 5);

      const [ challenge ] = await Hearts.initiateChallenge(USER1, USER2, 1, POLL_LENGTH);

      await Polls.submitVote(challenge.poll_id, USER1, YAY);
      await Polls.submitVote(challenge.poll_id, USER2, NAY);
      await Polls.submitVote(challenge.poll_id, USER3, YAY);

      await sleep(POLL_LENGTH);

      await Hearts.resolveChallenge(challenge.id);
      await sleep(1);

      await expect(Hearts.resolveChallenge(challenge.id))
        .to.be.rejectedWith('Challenge already resolved!');
    });
  });

});