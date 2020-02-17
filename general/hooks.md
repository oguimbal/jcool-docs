# What is an API hook ?

API hooks allow your servers to be notified when something happens on Justice.cool.

API hooks can be configured from your user interface, at [app.justice.cool/dev](https://app.justice.cool/dev)  (or at [app.staging.justice.cool/dev](https://app.staging.justice.cool/dev) for the dev environment).

You will be asked for an action to be performed for each type of event that can occur. For each event, you have 3 options:

- `Off` : Your API will not be notified, but it is very likely that you will receive an email instead to notify you.
- `Hook` : Justice.cool will perform an `HTTP POST` request to the given URL each time there is a new event  (see [POST strategy](#Post-strategy) section below)
- `Polling` : You will fetch new events regularly via our API (see [Polling strategy](#Polling-strategy) section below)


!> *IMPORTANT* Network reliability being what it is, and in order to prevent other unexpected side-effects, we strongly recommend you to implement [idempotence](https://stackoverflow.com/questions/1077412/what-is-an-idempotent-operation) on your hook operations.

# List of hook events

Here is a quick description of the hooks you might want to implement.

Each hook corresponds to an event in a dispute lifecycle. Some might be called often, some might never be called.

You are not required to implement all of them: You can progressively opt-in our API and improve your automation step-by-step, based on your needs.

| Hook | Event description | Data received | Required action |
| :----: | ----------- | :-------------: | :---------------: |
| `mediationSuccess` |  A mediation has succeeded | A contract (PDF) | - |
| `mediationFailure` | A mediation has failed | Proof of mediation failure (PDF) | - |
| `message` | Someone sent a message to this dispute | - | - |
| `mediationNegociation` | Your opponent has posted a counter proposition in this dispute | - | Agree/reject/counterpropose your opponents proposition |
| `requiredSignature` | When using `signatureMode: manual`, this will be called when a contract needs to be signed | - | Sign the contract |
| `newDispute` | Someone wants to start a mediation with you | - | Agree/reject/counterpropose your opponent proposition |
| `sleepingDispute` | You did not complete your file in time, so your file has been closed | - | - |


# POST strategy

This is the easiest and safest way to implement hooks. However, it requires your server to expose a public HTTP endpoint.

Each hook you defined will be called to the given adress, using an `HTTP POST`, with some data related to your hook as a JSON body. This body will look like this:


```typescript
{
  "hookId": "XXXXXXXXX", // Hook ID
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
==> gql
mutation GetHooks {
  hooks {
    list {
        # Get some info about the corresponding dispute
        dispute {
            id
            externalId
        }

        # Get some info about this hook
        hookId
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
==> variable ids
[]
==> gql
mutation MarkProcessedHooks($ids: [String!]!){
  hooks {
    markProcessed(hookIds: $ids)
	}
}
```

!> If you *forget* to poll hooks, you may never be notified when something happens. Please poll for changes regularily.

?> There is no need to call `markProcessed` if you subscribed using a `POST` strategy.

# Which data will I get ?

In either case (polling or POST strategy), you might get a hook data with each event that you might encounter.

Most of the event will not have any associated data (meaning that you will be responsible for collecting the data you need to process the hook from our API).

Here is the list of specific events that are providing data on hook:

## Invitation to a new mediation

When someone invites you to a new mediation, this hook will be called with a link to the invitation from

```json
{
  "invitationForm": "https://some-link-to-a-form"
}
```

## Message received

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

## Mediation success

When a mediation succeeds, this hook will be called with data that contains a link which enables you to download the contract that you and your opponent have signed.

```json
{
  "contract": "https://some-link-to-a-pdf-file"
}
```

!> This link will only be valid for 24h after the hook has been enqueued in our systems. Be sure to download it before that (however, the contract will be downloadable via your user space or via our API afterwards).
