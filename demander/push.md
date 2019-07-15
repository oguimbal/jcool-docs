
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
mutation CreateDispute($variables: [VariableDataInput!]) {
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
      variables: $variables
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
      id
      link
    }
  }
}



==> height very-tall
==> $variables
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


It must be noted that if some information is missing, the dispute **will** be created (thus, you will have an ID), in a dormant state. But you will also be given the *form* property, which contains a link to a form that must be filled to complete the dispute. i.e. something like this:

```json
[...]
"form": {
    "id": "01DFKD490BADBC4FS95SH5RA16",
    "link": "https://app.staging.justice.cool/form/01DFKD490BADBC4FS95SH5RA16"
}
```


?> Please head to [the playground](/playground.md) to inspect detailed schema information and documentation.


# How do I fill "variables" ?

You may have noticed that you have to fill "variables", which are all the facts about your dispute. It looks like:

```json
[
    { "variable": "age", "answer": 35 },
    { "variable": "country", "answer": "France" }
]
```

If you want to leverage justice.cool scoring, variables that you provide us must match variables that we know about.
A complete list of "existing" variables [can be found here](/known-variables.md)


# How do I fill "claims" ?

You can optionnaly specify manual claims for each demander. Doing so, you can enforce justice.cool to take claims into account that would not have been created automatically (when updateMode: auto).

?> If you use "updateMode: manual", then you **must** specify claims manually.


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
            # Add a first claim manually
            { name: "My claim 1", compensation: { amount: 123 } }
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