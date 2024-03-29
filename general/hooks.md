# What is an API hook ?

API hooks allow your servers to be notified when something happens on Justice.cool.

Each hook corresponds to an event in a dispute lifecycle. Some might be called often, some might never be called.

You are not required to implement all of them: you can progressively opt-in our API and improve your automation step-by-step, based on your needs.

API hooks can be configured from your user interface, at [app.justice.cool/dev](https://app.justice.cool/dev) (or at [app.staging.justice.cool/dev](https://app.staging.justice.cool/dev) for the dev environment).

You will be asked for an action to be performed for each type of event that can occur. For each event, you have 3 options:

- `Off` : Your API will not be notified, but it is very likely that you will receive an email instead to notify you.
- `POST` : Justice.cool will perform an `HTTP POST` request to the given URL each time there is a new event (see [POST strategy](#Post-strategy) section below)
- `Polling` : You will fetch new events regularly via our API (see [Polling strategy](#Polling-strategy) section below)

!> _IMPORTANT_ It should never be the case, but always assume that you could receive a hook message multiple times. Thus, to avoid unexpected side-effects, we strongly recommend you to implement an [idempotent](https://stackoverflow.com/questions/1077412/what-is-an-idempotent-operation) hook processing. Tip: Each hook event has an unique ID which you can use to filter out events that you already have processed.

# POST strategy

This is the easiest and safest way to implement hooks. However, it requires your server to expose a public HTTP endpoint.

Each hook you defined will be called to the given adress, using an `HTTP POST`, with some data related to your hook as a JSON body. This body will look like this:

```typescript
{
  "hookId": "XXXXXXXXX", // Hook ID - You can use this to implement idempotency
  "hookName": "someHook", // Hook type (see HookName enum)
  "disputeId": "CFR-XXXXXX", // Associated dispute ID
  "externalId": "YOUR-REF", // A reference that you might have given us when creating or associating with the dispute
  "retryCount": 2, // number of times that this hook has been re-sent to you (in case of errors)
  "data": {
    // Some OPTIONAL data specific to this hook type
  }
}
```

See [section below](#which-data-will-i-get-) for details about hook-specific data that might appear in the `data` property.

Justice.cool will consider the hook as processed once your server replied with a success HTTP status code.

?> In case your server failed to respond to a hook, Justice.cool will retry to call it after 3min, 10min, 50min, 3h and then 10h. It will be retried no further afterwards.

?> If your server experienced a long shutdown, you might want to explicitely poll hooks each time your server starts in order to catchup hooks that you may have missed (refer to the [Polling strategy](#Polling-strategy) section below)

# Polling strategy

?> This strategy is quite useful for dev purposes or if your server has no public endpoint.

When using a polling strategy, justice.cool will store a collection of hooks that you should process, and wait until you ask for them.

The processing of an event then occurs in two phases:

- You ask for hooks waiting to be processed
- Once you processed them, you must call justice.cool API to acknowledge the processed hooks.

## Getting hooks to process

You can get hooks waiting to be processed using something like the following request

```playground
==> fullpage
==> schema
==> gql
mutation GetHooks {
  hooks {
    list {
        # Get some info about the corresponding dispute
        dispute {
            id
            externalId
        }

        # Hook ID - You can use this to implement idempotency
        hookId

        # Get some info about this hook
        hookName
        data
        time
        retryCount
    }
  }
}
```

!> Getting hooks to process is **NOT** enough to tell justice.cool that you have processed the waiting events. See next section.

?> You are strongly invited to explore the GraphQL schema around hooks to understand all the options that you have to implement this.

## Acklowledging processed hooks

Once you have processed some hooks that you fetched using polling strategy, you must tell Justice.cool that you have processed them using the `markProcessed` mutation.

```playground
==> fullpage
==> schema
==> variable ids
[]
==> gql
mutation MarkProcessedHooks($ids: [String!]!){
  hooks {
    markProcessed(hookIds: $ids)
	}
}
```

!> If you _forget_ to poll hooks, you may never be notified when something happens. Please poll for changes regularily.

?> There is no need to call `markProcessed` if you subscribed using a `POST` strategy.

# Which data will I get ?

In either case (polling or POST strategy), you might get a hook data with each event that you might encounter.

Most of the event will not have any associated data (meaning that you will be responsible for collecting the data you need to process the hook from our API).

Here is a list of some specific events that are providing data on hook.

**This list is not exhaustive** : you will find an exhaustive list of the available hooks directly in [the developper section](https://app.staging.justice.cool/fr/dev/api) of your user area.

## Invitation to a new mediation

This is the `newDispute` hook.

When someone invites you to a new mediation, this hook will be called, providing a link to the invitation from

```json
{
  "invitationForm": "https://some-link-to-a-form"
}
```

## Message received

This is the `message` hook.

When someone wrote a message to a dispute (either by mail or via the user area), you will get some info about this message:

```typescript
{
  // The message, translated if necessary in your prefered language
  "html": "<b>a message</b>", // Clean HTML message (safe for display, does not contain any CSS nor js scripts)
  "text": "a message",
  // an OPTIONAL property telling which was the original message (if was not in your prefered language)
  "original": {
    "html": "<b>un message</b>",
    "text": "un message",
    "language": "fr"
  },
  "sender": {
    "id": "xyz", // sender participant ID (unique in the given dispute)
    "role": "demander", // role of the participant (demander, defender, demanderLawyer, ...)
    "name": "Name of author"
  }
}
```

?> This hook is **also** called when **you** write a message on the dispute.

!> Be aware of the fact `sender` and `original` properties might be null (respectively if message received from an unknown sender, and if your opponent wrote in your prefered language)

## Rejected invitation

This is the `invitationRejection` hook.

It is triggered when someone rejects an invitation to join a lawsuit or a dispute.

```typescript
{
  "reject": {
    "id": "xyz", // sender participant ID (unique in the given dispute)
    "role": "defender", // role of the participant (demander, defender, demanderLawyer, ...)
    "name": "Name of the participant"
  },
  // An OPTIONAL message, that might have been provided when rejecting the invitation.
  "message": {
      "html": "<b>a message</b>", // Clean HTML message (safe for display, does not contain any CSS nor js scripts)
      "text": "a message",
      // an OPTIONAL property telling which was the original message (if was not in your prefered language)
      "original": {
        "html": "<b>un message</b>",
        "text": "un message",
        "language": "fr"
      }
  }
}
```

## Mediation success

This is the `mediationSuccess` hook.

When a mediation succeeds, this hook will be called and will provide data including a link to download the contract that you and your opponent have signed during the mediation.

```json
{
  "contract": "https://some-link-to-a-pdf-file"
}
```

!> This link will only be valid for 24h after the hook has been enqueued in our systems. Be sure to download it before that (however, the contract will be downloadable via your user space or via our API afterwards).

## Mediation failure

This is the `mediationFailure` hook.

When a mediation fails, this hook will be called and will provide data including a link which enables you to download the proof of mediation failure that can later be used in front of a judge.

```json
{
  "proofOfMediationFailure": "https://some-link-to-a-pdf-file"
}
```

!> This link will only be valid for 24h after the hook has been enqueued in our systems. Be sure to download it before that (however, the document will be downloadable via your user space or via our API afterwards).

# How to test ?

In the staging environmenent, for each hook there is a big blue button "Test this hook".
When clicking this button, you will be asked to provide a dispute id (or lawsuit id) from your staging environment.

You can then either :
- trigger the hook directly (best to test the polling strategy).
- get a CURL statement with test data allowing you to trigger your hook manually when testing locally (best to test the post strategy)

