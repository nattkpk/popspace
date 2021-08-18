// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'prisma'.
const prisma = require('./prisma');

/**
Manages life cycle of magic links.

Magic links permit executing various restricted access for
a given actor: e.g. unsubscribing from a mailing list.
*/
class Magic {
static actions = {
    UNSUBSCRIBE: 'unsubscribe',
    SUBSCRIBE: 'subscribe',
};

  constructor() {}

  async unsubscribeUrl(appUrl, magicLink) {
    return `${appUrl}/unsubscribe?code=${magicLink.code}`;
  }

  async createUnsubscribe(actorId) {
    const existingLink = await prisma.magicCode.findFirst({
      where: {
        actorId,
        expiresAt: null,
        resolvedAt: null,
        action: Magic.actions.UNSUBSCRIBE,
      },
    });
    if (existingLink) {
      return existingLink;
    }
    return await prisma.magicCode.create({
      data: {
        actorId,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'shared'.
        code: shared.lib.otp.generate(),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'shared'.
        issuedAt: shared.db.time.now(),
        /**
          According to the CAN SPAM guidelines
          https://www.ftc.gov/tips-advice/business-center/guidance/can-spam-act-compliance-guide-business
          unsubscribe links have to be active for at least 30 days.

          But according to us and the internet, there is no reason to make these links expire
          https://security.stackexchange.com/questions/115964/email-unsubscribe-handling-security
        */
        expiresAt: null,
        action: Magic.actions.UNSUBSCRIBE,
      },
    });
  }

  async createSubscribe(actorId) {
    const existingLink = await prisma.magicCode.findFirst({
      where: {
        actorId,
        expiresAt: null,
        resolvedAt: null,
        action: Magic.actions.SUBSCRIBE,
      },
    });
    if (existingLink) {
      return existingLink;
    }
    return await prisma.magicCode.create({
      data: {
        actorId,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'shared'.
        code: shared.lib.otp.generate(),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'shared'.
        issuedAt: shared.db.time.now(),
        /*
          It's ok to never expire these - as long as they don't log you in.
        */
        expiresAT: null,
        action: Magic.actions.SUBSCRIBE,
      },
    });
  }

  magicLinkByCode(code) {
    return prisma.magicCode.findUnique({ where: { code } });
  }

  async tryToResolveMagicLink(request, expectedAction) {
    if (request.action != expectedAction) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'shared'.
      return { error: shared.error.code.MAGIC_LINK_INVALID_ACTION };
    }
    switch (request.action) {
      case Magic.actions.UNSUBSCRIBE:
        return await this.unsubscribe(request);
      case Magic.actions.SUBSCRIBE:
        return await this.subscribe(request);
      default:
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'shared'.
        return { error: shared.error.code.MAGIC_LINK_INVALID_ACTION };
    }
  }

  tryToUnsubscribe(request) {
    return this.tryToResolveMagicLink(request, Magic.actions.UNSUBSCRIBE);
  }

  tryToSubscribe(request) {
    return this.tryToResolveMagicLink(request, Magic.actions.SUBSCRIBE);
  }

  // Private
  async unsubscribe(request) {
    const validation = await this.requireActor(request);
    if (validation.error) {
      return validation;
    }
    // Usually we'd want to mark the magic link as expired in a transaction,
    // but there is no reason to invalidate unsubscribe links.
    // https://security.stackexchange.com/questions/115964/email-unsubscribe-handling-security
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'shared'.
    await shared.db.accounts.newsletterUnsubscribe(
      request.actorId || request.actor_id,
    );
    return {};
  }

  async subscribe(request) {
    const validation = await this.requireActor(request);
    if (validation.error) {
      return validation;
    }
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'shared'.
    await shared.db.accounts.newsletterSubscribe(
      request.actorId || request.actor_id,
    );
    return {};
  }

  async requireActor(request) {
    const actorId = request.actorId || request.actor_id;
    const actor = await prisma.actor.findUnique({ where: { actorId } });
    if (!actor) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'shared'.
      return { error: shared.error.code.NO_SUCH_ACTOR };
    }
    return {};
  }
}

module.exports = new Magic();
