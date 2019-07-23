
# Push a new dispute

!> You must read [usual lifecycle of a dispute](/#usual-lifecycle-of-a-dispute) to understand this section

You will have to push information about your litigation so justice.cool can start a mediation with your opponent.

Justice.cool also provides optional services to ease the process, which are opt-in when creating the dispute:

- **Scoring & auto claim computation**: Leverages justice.cool modelization and machine learning algorithms to compute the claims you are entitled to.
- **Onboarding**: If you opted in for scoring & claim computation, and that we detect that information is missing given what you sent us, then you can instruct us to create a form to fill-in this information manually. If you do not opt-in for this feature, then the dispute creation will fail.
- **Contact**: Once the dispute is created, you can choose whether if you want us to contact the opponent for you (or you will have to contact them yourself - IMPORTANT : see the [terms of use](/tos.md) of our API for this case)

!> We will not perform the "File checking" step described in [usual lifecycle of a dispute](/#usual-lifecycle-of-a-dispute): justice.cool cannot be held responsible for the non validity of the documents you send us.

?> The later steps described in [usual lifecycle of a dispute](/#usual-lifecycle-of-a-dispute) are not (yet) in the scope of our public API: Disputes created though this API will be considered as completed once mediation ends (see "end" hook)

# Show me some code

A bit of code can be worth a thousand lines:

?> Dont be affraid to run the code below, it will create a dispute on the **staging** environment, which is free, and which does not contact your opponent in real life.

```graphql
mutation CreateDispute($facts: [FactDataInput!]) {
  createDispute(
    data: {
      # tells justice.cool to create a form if some info is missing
      features: [onboarding]
      # how claims will be created/deleted
      updateMode: auto
      # how contracts will be signed
      signatureMode: auto
      # an arbitrary external ID that might be useful to you
      externalId: "my id"
      # Data describing the litigation. See "Query variables" tab below
      facts: $facts
      # Who is the demander of this dispute ?
      demanders: [{ person: { firstName: "Perh", lastName: "Sohn" } }]
      # Who is the opponent in this dispute ?
      opponent: {
        # opponent is a company: must be identified using SIREN
        company: { country: france, identifier: "80314744600022" }
        # when opponent is a company, contact means are optional
        contactMeans: [
          # you can specify this to tell justice.cool to also contact company as it is used to
          { auto: true, mode: free }
          # specifying this, justice.cool will also send a "recommandé électronique" to this address to contact them:
          { email: "perh.sohn@nobody.com", mode: premium }
        ]
      }
    }
  ) {
    # == selects the created dispute ID
    id
    details {
      link
    }
    # == if some info is missing, this form must be filled
    form {
      link
    }
  }
}



==> height very-tall
==> $facts
[   {
        variable: 'litigationType',
        answer: 'work'
    }, {
        variable: 'categoryOfYourProblem',
        answer: 'fired'
    }, {
        variable: 'typeOfDismissal',
        answer: 'dismissalForSimpleFault'
    }, {
        variable: 'dateOfNotificationOfDismissal',
        answer: moment().add(-5, 'days').toDate(),
    }, {
        variable: 'priorNotice',
        answer: false,
    }, {
        variable: 'dateOfTheFault',
        answer: moment().add(-15, 'days').toDate()
    }, {
        variable: 'ageOfTheApplicant',
        answer: 35
    }, {
        variable: 'typeOfFault',
        answer: 'blablah',
    }, {
        variable: 'layoff',
        answer: false,
    }, {
        variable: 'startDateOfYourEmploymentContract',
        answer: moment().add(-400, 'days').toDate(),
    }, {
        variable: 'justificationOfDismissal',
        answer: false,
    }, {
        variable: 'protectedEmployee',
        answer: false
    }, {
        variable: 'collectiveLicensing',
        answer: false,
    }, {
        variable: 'haveYouEverBeenSubjectToSimilarSanctions',
        answer: false,
    }, {
        variable: 'levelOfResponsibility',
        answer: 'moderateLiability'
    }, {
        variable: 'socialRightClaimCategory',
        answer: 'financialCompensation'
    }, {
        variable: 'doYouHaveANoticePeriod',
        answer: false,
    }, {
        variable: 'isItWanted',
        answer: false,
    }, {
        variable: 'leaveLeft',
        answer: true,
    }, {
        variable: 'numberOfLeavesLeft',
        answer: 25
    },
    {
        variable: 'howManyDaysOfVacationsAreYouEntitledToPerYear',
        answer: 30
    }, {
        variable: 'conventionCollective',
        answer: 'insurance',
    },


    // those variables are "private" (tied to a demander)
    // but you can specify them globaly (i.e. not on the demander) when there is only one demander.
    {
        variable: 'positionHeld',
        answer: 'managerialStaff'
    },
    {
        variable: 'howAreYouPaid',
        answer: ['salary'],
    }, {
        variable: 'monthlySalary',
        answer: 2500
    }
]

==> wrapper Typescript
await api.createDispute({ /* Creation data (see GraphQL) */});
```


If you execute this, a dispute will be created in Justice.cool, and you will be returned something like:

```json
{
  "data": {
    "createDispute": {
      "id": "CFR-20190712-IA6",
      "details": {
        "link": "https://app.staging.justice.cool/user/case/CFR-20190712-IA6"
      },
      "form": null
    }
  }
}
```


It must be noted that if some information is missing, the dispute **will** be created (thus, you will have an ID), in a dormant state. But you will also be given the *form* property, which contains a link to a form that must be filled to complete the dispute.

*Example:* You could also get in the answer above something like this:

```json
[...]
"form": {
    "link": "https://app.staging.justice.cool/form/01DFKD490BADBC4FS95SH5RA16"
}
```


?> Please head to [the playground](/playground.md) to inspect detailed schema information and documentation.


# What are "facts", and how do I fill that ?

You may have noticed in the example above that you have to fill "facts", which are all the facts about your dispute. It looks like:

```json
[
    { "variable": "age", "answer": 35 },
    { "variable": "country", "answer": "France" }
]
```

If you want to leverage justice.cool scoring, variables that you provide must match variables that we know about.
A complete list of "existing" variables [can be found here](/known-variables.md).


Variables are facts that will be discused one by one during the mediation process with your opponent. As such, the "variables" you provide here are only *your version* of the facts, which your opponent will probably try to challenge.


# How do I fill "claims" ?

Claims are what you are asking for to your opponent. Once all facts have been discussed and negociated between you and your opponent, you will have to discuss the claims, and negociate them in order to find an amicable solution.


You can **optionnaly** specify *manual* claims for each demander. Doing so, you can enforce justice.cool to take claims into account that might not have been created automatically (when updateMode: auto).

To better understand how claims are created and later updated during mediation, you have to understand 3 parameters:

- When creating the dispute, you specify a global parameter `updateMode`: It defines how "automatic" claims are created and deleted during the mediation.
- Additionaly, you can provide two options on each claim you manually create:
    * `eligibilityMode`: It overrides the global `updateMode` for the given claim, thus defining if justice.cool is in charge of creating/deleting this claim when needed.
    * `compensationMode`: It tells justice.cool how the amount of this claim must be computed.

In each case, setting a parameter to "manual" tells justice.cool: *dont delete or update this automatically, i'm in charge of it !*.

?> If you use `updateMode: manual`, then you **must** specify claims manually.

?> If you dot not provide any specific claim, then justice.cool will automatically compute them based on "variables" you provided (`updateMode` mode is not "manual").

This mechanisms give you a wide range of options to handle your claims, from completely automatic to completely manual. We will review below a couple of common use cases.


## Completely custom claims


You can create completely custom claims, which justification will be opaque to justice.cool (thus also possibly opaque to your opponent).
This might be usefull for one-time or very specific litigations types which you know very well about, or that are not well handled by justice.cool in your opinion (by the way, dont hesitate to tell us more about them so we can improve justice.cool !).

On another hand, such claims will not be scored, nor updated automatically by justice.cool.

For instance, the request below creates a new dispute with only two custom claims (and no variable data).


```graphql
mutation CreateDispute($opponent: OpponentInput!) {
  createDispute(
    data: {
      # see above for those
      features: [onboarding]
      signatureMode: auto
      variables: []
      opponent: $opponent
      # tells justice.cool to only take manual claims into account
      updateMode: manual
      # Who is the demander of this dispute ?
      demanders: [
        {
          person: { firstName: "Perh", lastName: "Sohn" }
          claims: [
            # Add a monetary compensation claim
            {
              name: "Raw material reimbursement"
              compensation: { amount: 123 }
            }
            # Add a service claim
            {
              name: "Rebuild house"
              service: {
                delay: 45
                description: "I want my house rebuilt from the ground up !"
              }
            }
          ]
        }
      ]
    }
  ) {
    # == selects the created dispute ID
    id
    details {
      link
    }
  }
}

==> height tall
==> $opponent
{
    company: { country: 'france', identifier: '80314744600022' },
    contactMeans: [
        { auto: true, mode: 'free' }
    ]
}
```

!> It might not be a good idea to push this kind of raw custom claims without variables: You should also push variables, which represents facts that will be discussed between you and your opponent. Without those, you have little material to discuss/negociate on in order to help you find an amicable solution.

## Claims scored by justice.cool, with custom amount

If you want your claims to be "scored" by justice.cool, you **must** provide on your custom claims a "typeId" that matches a type of claim [that we know about](/known-variables.md#claim-types).

These claims have been modelized by our jurists and our data scientists so we can provide you an indicative score of your probability of success in court, based on the word of law, and on machine learning algorithms that will analyze past decisions of cases similar to yours.

?> Creating "scored" claims might help you and your opponent to evaluate your legitimity. Scores are updated each time you negociate a fact with your opponent during the mediation process. It is an indicative score which relies on our jurists understanding of your dispute, and on machine learning algorithms.
