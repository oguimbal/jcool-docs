# Quickstart

Justice.cool API is requestable through a GraphQL endpoint, which you can request **from your server**



?> If you already have API keys, you can use [the playground](/playground.md) to play with your dev key, or [here for production environment](https://api.justice.cool/v1).

# Creating an API key

You can create a [production api key here](https://app.justice.cool/account). API keys are necesary to request our public API from your servers.

They must be passed as a header with every GraphQL request you will issue to us:

```json
{
    "Authorization": "Bearer <YOUR API KEY>"
}
```


!> **YOUR API KEY IS PRIVATE ! DO NOT SHARE IT !**

!> In the production environment, **real charges** might incur and **real opponents** will be contacted. If you're looking for testing our api, head to [dev environment](#dev-environment)


# Dev environment

We provide a *dev* environment, where no charge applies, and no real opponent will be contacted: Your are safe to do whatever you like on this environment, there will be no big consequence.

The dev api is available through [the playground](/playground.md), where you will be prompted to create a dev api key. Note that you could also access it directly  [here](https://api.staging.justice.cool/v1) if you already have one.

?> Instead of contacting real opponents, justice.cool will send you an email at the contact address you provided when creating your dev key.

?> You will notice that we call your *dev* environment corresponds to our *staging* environment. As such, it will include all the latest features we have not pushed in production yet. It might also be a bit more unstable, and we guarantee no SLA for it.