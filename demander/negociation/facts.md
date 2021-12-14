# Negociating facts

?> Please read [introduction](/demander/negociation/intro.md) first


## How do I know that I should review a fact ?

Justice.cool will tell you when you should review something using [API hooks](/general/hooks.md).

There are two cases when you are expected to review facts/claims:

-  When you are a defender company, and have been invited to a mediation, through the `newDispute` hook.
-  When the `mediationNegociation` hook is called, informing you that it is your turn to review the dispute.

When those hooks are called, you are expected to retreive facts to be reviewed, through a query like this one:


```playground
==> height medium
==> fullpage
==> schema
==> variable disputeId
"CFR-XXXXXXX-XXX"

==> gql
query GetFactsToReview($disputeId: String!) {
  dispute (id: $disputeId) {
    facts(onlyWaitingMyReview: true) {

      # The reference of this answer
      ref
      # The answered value, or null
      # (if fact has been rejected by your opponent)
      value

      # === Those are optional, but important ones ====

      # The fact variable ID that is referenced
      # (see https://docs.justice.cool/#/known-variables)
      variable
      # This will be set when a fact is "personal"
      #  (when there is one version of this fact for each demander)
      participant { name }
    }
  }
}

==> wrapper Typescript
const dispute = this.api.getDispute('CFR-XXXXXXX-XXX');
const facts = await dispute.getFacts({onlyWaitingMyReview: true});
```

!> This query does not always return results !

If this query returns an empty array, then you are NOT expected to review any fact. This could mean one of those two things:

- It is not your turn to review facts (your hook may have been called after a long time, and someone has filled the corresponding `ping-pong` form meanwhile)
- All facts have been reviewed: Your hook has been called in order to [Negociate claims](/demander/negociation/claims.md).



## How do I review facts ?

Once you have gathered all facts to be reviewed, you will have to give your point of view on all of those.

For each fact, your point of view can be one of those things:


- **Accept** the fact, if you agree with its current value
- **Give your version** of this fact *(+ an optional comment)*
- **Reject** this fact, and ask a correction to your opponent *(with an optional comment)* **- see note below**

?> The **Reject** options is only valid when **you are NOT the person who originaly authored this fact** (which is the demander, for most of facts)


Once your point of view has been settled, you will have to post it to Justice.cool through a query like the following:


```playground
==> height medium
==> fullpage
==> schema
==> variable disputeId
"CFR-XXXXXXX-XXX"

==> gql
mutation ReviewFacts ($disputeId: String!) {
  dispute (id: $disputeId) {
    amendFacts(facts: [{
      # This will post your version ("123") for the fact "fact ref"
      ref: "fact ref",
      value: 123,
      comment: {html: "An optional comment to argument your point of view..."}
    }, {
      # This will tell your opponent that you reject this fact
      # thus asking him or her to correct it
      ref: "other fact ref",
      value: null,
      comment: {
        html: "An optional comment to tell why it should be corrected...",
        # a set of document you might want to send to your opponent
        documents: ["https://my-doc-url"]
      }
    }])
  }
}

==> wrapper Typescript
const dispute = this.api.getDispute('CFR-XXXXXXX-XXX');
await dispute.pushFactCorrections([{
            // This will post your version ("123") for the fact "fact ref"
            ref: 'fact ref',
            value: 123,
            comment: { html: 'An optional comment to argument your point of view...' }
        }, {
            // This will tell your opponent that you reject this fact
            // thus asking him or her to correct it
            ref: 'other fact ref',
            value: null,
            comment: {
                html: 'An optional comment to tell why it should be corrected...',
                // a set of document you might want to send to your opponent
                documents: ['https://my-doc-url']
            }
        }])

```


?> **Note 1:** This query is an example - you will probably want to turn the `facts` parameter into a query argument (like `disputeId`).

?> **Note 2:** The comment associated to each review is optional. You can also join documents as URLs, or as references (see [Upload documents](/general/documents.md) section)


## What happens when I reviewed facts ?

Once you called the `amendFacts` mutation, 3 things happen:

- All the facts that you **have not** mentioned will be considered as **accepted** (i.e. call `amendFacts([])` to accept all facts).
- All claims will be updated, based on your amendments to your facts:
  * If the demander has told justice.cool to use automatic eligibility, some claims might be added or deleted
  * If the demander has told justice.cool to use automatic amounts, some claim amounts might be changed
  * In some cases, changing a fact might change how Justice.cool sees the case, and thus require information that was not previously filled.
    You might thus have to provide them - depending on who you are, and whom is supposed to provide them (see next section)



## What should I do once I reviewed facts ?

?> **NB:** This tutorial shows how to implement a **fully automated scenario**. But some cases could get quite complicated. In those cases, you can always review facts that can be automated automatically, then tell a human to handle the complicated bits via the corresponding ping-pong form that is available on your dispute in Justice.cool user area.

Once facts are reviewed, you're not finished !

**If you have posted reviews**, you must check that there is no missing information (see previous section).
   You can check that on the `amendFacts()` mutation result. If there is some missing info, you have to either:
- Ask a human to fill the given form (if you do not want to automate this).
- Or provide the missing information via a call to `addMissingFact()` mutation (check the GraphQL schema documentation), which could **ALSO** ask for further information. Then repeat until no further information is asked.


Once this is done, you will have to [review claims](/demander/negociation/claims.md)