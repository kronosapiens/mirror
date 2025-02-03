.. _hearts:

Hearts
======

`Install Hearts ↗ <https://hearts.mirror.zaratan.world/slack/install>`_

Quickstart
----------

1. Set an app events channel
2. Encourage people to give karma (``@Kira ++``) if someone exceeds expectations
3. That's it! Everything else is automatic.

Introduction
------------

Every community begins with the best of intentions.
And every community, invariably, experiences conflict.
Experiencing conflict is not a choice.
Handling it is.

Communities can choose to ignore conflict, letting it build and fester until communal bonds are permanently damaged.
Communities can also choose to evade responsibility, giving away power and agency to an authority figure who promises to make the problems go away, but never really does.
Or communities could choose to face conflict head-on, engaging in the essential relational processes which lead to fulfilling long-term relationships.

Hearts is an accountability tool, used to help **structure the experience and resolution of conflict**.
Hearts is designed with two goals in mind: first, to give members of a community meaningful tools for holding each other accountable; second, to emphasize communication and repair over judgment and punishment.

Core Concepts
-------------

Hearts
  The core concept of Hearts is, unsurprisingly, **hearts**.
  Everyone starts with five hearts, and gains and loses them as the result of various processes.

Karma
  Much of Hearts is about handling conflict.
  But what about all the good things that happen, which are in all likelihood the majority of the interactions occurring among the residents? For that we have **karma**.
  Anyone can give karma to another resident by adding a "plus-plus" (``@Kira ++``) after their name.
  Every month, all the karma is taken together, and the resident(s) with the most karma get a bonus heart.
  By earning karma, it is possible to have an epic **six** or even **seven** hearts.

Regeneration & Fading
  It is said that time heals all wounds.
  Whether or not that is true is a question for psychologists and philosophers.
  What we can say with confidence is that **time restores lost hearts**.
  Specifically, a half-heart per month, for everybody, always.
  This is how we center **rehabilitation over punishment.**
  If you lose a heart for whatever reason, integrate the lesson, and soon enough it will be forgotten.
  Hearts regeneration will only take you back to the five-heart baseline.
  If you already have five, you don't get more.
  If you have bonus hearts (from earning karma), you'll fade back to five at the same rate.

Basic Functionality
-------------------

.. image:: https://s3.amazonaws.com/zaratan.world/public/images/mirror/framed-mobile-hearts-home.jpg
  :width: 400
  :alt: Hearts app home
  :align: center

The Hearts home page is the hearts dashboard.
On the home page, folks can see their current hearts.
The app home is also the entryway into the basic functionality, described below:

:guilabel:`Resolve a dispute`
  The most dramatic way to lose hearts is by having another resident call you out for bad behavior, by issuing a **challenge** (analogous to "getting a strike").
  This, rightly, is an uncomfortable experience, but a necessary one, as the final step in the :ref:`conflict resolution <conflict-resolution>` process.
  If you couldn't be called out, or you couldn't call someone else out, then there would be no accountability: problematic behavior would continue until someone moved out, clearly not an outcome to be proud of.
  By issuing and receiving challenges, we create a structure for engaging **proactively** with conflict.

  Anyone can issue a challenge, stating a number of hearts they think you should lose (up to three), and the reasoning.
  The issue then goes to a vote.
  If you lose, you lose hearts.
  If your challenger loses, they lose hearts.
  As a way to prevent abuse, a challenger needs a *minimum* of 40% of the house to support them to win, otherwise they lose by default.
  If losing the challenge will leave the challenged with one heart (or none), then the challenge needs the support of at least 70% of the house.
  This is how we protect minorities from abuse, while respecting the judgment of the majority.

  It is very unlikely someone will be challenged arbitrarily, as the challenger is strongly disincentivized from doing so.
  Anyone who issues a challenge stands to lose hearts themselves, if other residents feel they are out of line or being abusive.
  Instead, challenges should (ideally) come as no surprise, and represent a final step in a :ref:`respectful process of disagreement <conflict-resolution>`.

:guilabel:`See current hearts`
  Pull up a view showing everyone's hearts, ordered from most to least.

Slash Commands
--------------

In addition to the home page, Hearts comes with a number of "slash commands" which provide some important management functions.
Most people will not need to know about these commands to use Hearts.

.. note::

  Commands marked with an asterisk (*) are admin-only

``/hearts-channel`` \*
  The ``/hearts-channel`` command is used by workspace administrators to set the events channel for Hearts, which is where app activity is posted and where housemates go to vote on challenges.
  This command takes no arguments, and will set the events channel to the channel in which the command is invoked.
  If set to a public channel, the app will automatically join the channel.
  If set to a private channel, the app must be added manually.

  .. warning::

    A channel **must** be set for the app to work.

``/hearts-prune``
  The ``/hearts-prune`` command will deactivate any users no longer in the workspace.
  The app will normally prune users in the background, but this command can force a sync if necessary.

``/hearts-sync``
  The ``/hearts-sync`` command will sync the Hearts app to all public channels, allowing people to give karma in those channels.
