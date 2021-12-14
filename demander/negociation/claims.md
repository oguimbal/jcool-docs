# Negociating claims

?> Please read [introduction](/negociation/intro.md) first

!> This part describes actions that require you to already have [reviewed facts](/negociation/facts.md).


## How do I know that I should review a claim ?

You must review claims just after having reviewed facts, as described in [the previous tutorial](/negociation/facts.md).

You can retrieve which claims you are expected to review via a query like this one:


```playground
==> height tall
==> fullpage
==> schema
==> variable disputeId
"CFR-XXXXXXX-XXX"

==> gql
query GetClaimsToReview($disputeId: String!) {
  dispute(id: $disputeId) {
    claims {
      id
      # Get my opponent last proposition
      lastProposition {
          ...PropositionFragment
      }
    }
  }
}


fragment PropositionFragment on ClaimProposition {
      # Select common properties
      ...on IClaimProposition {
        status
        score {success}
        # Select my opponent (optional) comment & documents
        comment {html, documents { link } }
      }
      # Select properties for service claims
      ...on ClaimServiceProposition {
        service {delay}
      }
      # Select properties for compensation claims
      ...on ClaimCompensationProposition {
        compensation {amount currency}
      }
}

==> wrapper Typescript
const dispute = this.api.getDispute('CFR-XXXXXXX-XXX');
const claims = await dispute.getClaims({onlyWaitingMyReview: true});
```

!> This query does not always return results !

?> Of course, as always with GraphQL, you can tweak this query to get more or less data, depending on what you need. The above query shows how to use [GraphQL fragments](https://www.apollographql.com/docs/angular/features/fragments/), which are useful to avoid repeating yourself if you plan to select past propositions.

If this query returns an empty array, then you are NOT expected to review any claim. This could mean one of these three things:

- It is not your turn to review claims (your hook may have been called after a long time, and someone has filled the corresponding `ping-pong` form meanwhile).
- All facts have not yet been reviewed.
- All claims have been reviewed, and your dispute is resolved.


## How do I review claims ?


Once you have retrieved all claims to be reviewed, you will have to give your decision for each claim.


Your decision can be:

- **Accept**: Will consider your last opponent proposition as accepted.
- **Counterpropose**: Make another proposition for the claim (new amounnt or delay)  *(with an optional comment)*.
- **Reject** the claim, this will ask your opponent to abandon the claim *(with an optional comment)*


!> When you post an `Accept` decision on an `Abandon` proposition, it will tell justice.cool that you accept to abandon this claim !


```playground
==> height tall
==> fullpage
==> schema
==> gql
mutation {
  dispute(id: "CFR-XXXXXXXX") {
    # Accept last decisions of those claims
    acceptClaims(claims: ["XXXX"])

    # Posts counter propositions
    counterProposeClaims(propositions: [
      # Posts a counter proposition
      #  for a compensation claim
      {
        claimId: "XXXX",
        compensation: {amount: 123, currency: EUR}
        # Some (optional) comment + (optional) documents
        comment: {
          html: "Some comment telling why...",
          documents: [],
        }
      },
      # Posts a counter proposition
      #   for a service claim
      {
        claimId: "XXXX",
        service: {delay: 42}
        # Some (optional) comment + (optional) documents
        comment: {
          html: "Some comment telling why...",
          documents: [],
        }
      }
    ])

    # Asks your opponent to abandon those claim
    rejectClaims(reject: [{
      claimId: "XXXX",
        # Some (optional) comment + (optional) documents
        comment: {
          html: "Some comment telling why...",
          documents: [],
        }
    }])
  }
}

==> wrapper Typescript
const dispute = this.api.getDispute('CFR-XXXXXXX-XXX');
// Accept last decisions of those claims
await dispute.acceptClaims(['XXXX'])
// Posts counter propositions
await dispute.postClaimCounterPropositions([
    // Posts a counter proposition
    //  for a compensation claim
    {
        claimId: 'XXXX',
        compensation: { amount: 123, currency: Currency.Eur },
        // Some (optional) comment + (optional) documents
        comment: {
            html: 'Some comment telling why...',
            documents: [],
        }
    },
    // Posts a counter proposition
    //  for a service claim
    {
        claimId: "XXXX",
        service: { delay: 42 },
        // Some (optional) comment + (optional) documents
        comment: {
            html: "Some comment telling why...",
            documents: [],
        }
    }]);
// Asks your opponent to abandon those claim
await dispute.rejectClaims([{
    claimId: "XXXX",
    //  Some (optional) comment + (optional) documents
    comment: {
        html: "Some comment telling why...",
        documents: [],
    }
}])
```

?> **Note 1:** This query is an example - you will probably want to turn everyting into query arguments

?> **Note 2:** The comment associated to each review is optional. You can also join documents as URLs, or as references (see [Upload documents](/general/documents.md) section)

## What happens when I reviewed claims ?


- If you accepted everything, then your dispute is resolved !
- If you posted some counter-propositions or abandon-propositions, then your opponent will be notified: it is now his turn to review your propositions.


## What should I do once I reviewed claims ?


Once you reviewed all claims, you are not expected to do anything.

If your opponent reviews your propositions, this process will run again (you will be called via `mediationNegociation` hook once your opponent has reviewed your decisions)

If your mediation has succeded or failed, the corresponding [hooks](/general/hooks.md) will be called later, when Justice.cool has ensured that both parties have fulfilled their obligations (payment, etc...).