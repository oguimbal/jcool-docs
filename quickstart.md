# Quickstart

Justice.cool API is requestable through a GraphQL endpoint, which you can request **from your server**



?> If you already have API keys, you can use [the playground](/playground.md) to play with your dev key, or [here for production environment](https://api.justice.cool/v1).

# Creating an API key

You can create a [production api key here](https://app.justice.cool/account). API keys are necesary to request our public API from your servers.

The key must be passed as a header with every GraphQL request you will issue to us:

```json
{
    "Authorization": "Bearer <YOUR API KEY>"
}
```


!> **YOUR API KEY IS PRIVATE ! DO NOT SHARE IT !**

!> In the production environment, **real charges** might incur and **real opponents** will be contacted. If you're looking for testing our api, head to [dev environment](#dev-environment)


# Dev environment

We have opened our *staging* environment, where no charge applies and no real opponent will be contacted: you are safe to test your requests and do whatever you like on this environment, there will be no consequence.


- Justice.cool staging app is available at [app.staging.justice.cool](https://app.staging.justice.cool/), where you can [create a DEV api key](https://app.staging.justice.cool/dev/api).
- The endpoint you must request for this environment is [api.staging.justice.cool/v1](https://api.staging.justice.cool/v1)
- You can play with this endpoint via [the playground](/playground.md), or via any interactive tutorial in this documentation.

!> Do not use this environment in your **production** environment: It has no effect IRL :/

?> Instead of contacting real opponents, justice.cool will send you an email at the contact address you provided when creating your dev key.

?> You will notice that we call your *dev* environment corresponds to our *staging* environment. As such, it will include all the latest features we have not pushed in production yet. It might also be a bit more unstable, and we guarantee no SLA for it.


# Production environment

This is the *real* justice.cool. Charges may apply.

- You can create a production api key [here](https://app.justice.cool/subscribe)
- The production endpoint you must request is [api.justice.cool/v1](https://api.justice.cool/v1)

!> Real opponents will be contacted ! Do not play with this environment !

!> Charges may apply !


# Where to start ?

You can either explore our API through [the playground](/playground.md),
look at naive example API implementations examples [here](https://gitlab.com/justice.cool/autoresponders/tree/master/src/auto-reponders),
or find the right tutorial for you in this documentation and follow it.