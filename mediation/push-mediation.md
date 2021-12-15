
# Push a new mediation

This section is very similar to the section [Push a new file](/demander/push.md) but contains some information specific about mediation.

!> You must read [usual lifecycle of a dispute](/mediation/README.md#usual-lifecycle-of-a-dispute) to understand this section

To start a mediation with your opponnent, you have to push some information about your litigation to justice.cool. A new record, called a **dispute**, will then be created in Justice.cool platform.

When creating the dispute, you will be able to choose among optional services to ease the process :

- **Claim computation & Scoring**: this option leverages justice.cool modelization and machine learning algorithms to compute the claims you are entitled to.
- **Onboarding**: in case of opt-in for claim computation & scoring and that some information is missing for the model given what you sent us, you can instruct us to create a form to fill-in this information manually. If you do not opt-in for this feature, then the dispute creation will fail.
- **Contact**: you can choose if you want us to contact the opponent for you (or you will have to contact them yourself - IMPORTANT : see the [terms of use](/tos.md) of our API for this case)

!> When pushing a new mediation using the API, we will not perform the "File checking" step described in [usual lifecycle of a dispute](/mediation/README.md#usual-lifecycle-of-a-dispute) : justice.cool cannot be held responsible for the non validity of the documents you send us.

?> The later steps described in [usual lifecycle of a dispute](/mediation/README.md#usual-lifecycle-of-a-dispute) are not (yet) in the scope of our public API: Disputes created though this API will be considered as completed once mediation ends (see "end" hook)

# Show me some code

Here is the GraphQL mutation to push a new mediation to justice.cool.

You can find all the variables description (except for the facts) in the tabs **Docs** and **Schema** in each GraphQL playground on the right side.

The facts are listed in the tab "Query variables."

?> Don't be afraid to run the code below, it will create a dispute on the **staging** environment, which is free, and which does not contact your opponent in real life.

```playground
==> height very-tall
==> fullpage
==> schema
==> variable facts
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
        variable: 'birthDate',
        answer: '1987-02-28'
    },
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

==> gql
mutation CreateDispute($facts: [FactDataInput!]) {
  createDispute(
    data: {
      # which options to use
      features: [letMeCheckBeforeSending]
      # which sequence to start with for this dispute, here mediation
      startAt: mediation
      # how claims will be created/deleted
      updateMode: auto
      # how contracts will be signed
      signatureMode: auto
      # an arbitrary external ID that might be useful to you
      externalId: "my id"
      # data describing the litigation. See "Query variables" tab below
      facts: $facts
      # who is the demander of this dispute ?
      # if you specify either "person" or company", then this means that your company has been mandated for their representation.
      # ... if your company is the demander, then leave this blank.
      demanders: [{ person: { firstName: "Perh", lastName: "Sohn" } }]
      # who is the opponent in this dispute ?
      opponent: {
        # opponent is a company: must be identified using SIREN, or an ID know via https://docs.justice.cool/#/companies
        company: { identifier: "siret:80314744600022" }
        # when opponent is a company, contact means are optional
        contactMeans: [
          # you can specify this to tell justice.cool to also contact company as it is used to
          { auto: true }
          # specifying this, justice.cool will also send an email to this address to contact them:
          { email: "perh.sohn@nobody.com" }
        ]
      }
    }
  ) {
    # == selects the created dispute ID
    id
    details {
      link
    }
  }
}

==> wrapper Typescript
await api.createDispute({
      // which options to use
      features: [JCoolFeature.LetMeCheckBeforeSending]
      // which sequence to start with for this dispute, here mediation
      startAt: JcoolEntry.Mediation
      // how claims will be created/deleted
      updateMode: UpdateMode.Auto
      // how contracts will be signed
      signatureMode: SignatureMode.Auto
      // an arbitrary external ID that might be useful to you
      externalId: "my id"
      // Who is the demander of this dispute ?
      // If you specify either "person" or company", then this means that your company has been mandated for their representation.
      // ... if your company is the demander, then leave this blank.
      demanders: [{ person: { firstName: "Perh", lastName: "Sohn" } }]
      // Who is the opponent in this dispute ?
      opponent: {
        // opponent is a company: must be identified using SIREN, or an ID know via https://docs.justice.cool/#/companies
        company: { identifier: "siret:80314744600022" }
        // when opponent is a company, contact means are optional
        contactMeans: [
          // you can specify this to tell justice.cool to also contact company as it is used to
          { auto: true }
          // specifying this, justice.cool will also send an email to this address to contact them:
          { email: "perh.sohn@nobody.com" }
        ]
      }
      // Data describing the litigation.
      facts: [
        { variable: 'litigationType', answer: 'work' }
        /* ... other variables ... */
      ]
    }
  });

```


If you execute this:
- a new dispute will be created in Justice.cool
- the server will return a response in the form:

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

The id returned in the response is in the form "CFR-YYYYMMDD-xxxx" where YYYYMMDD is the actual date and xxxx is a 4-character string.

<!-- **Note when** `updateMode: auto`

If some information is missing, the dispute **will** be created (thus, you will have an ID), in a dormant state. But you will also be given the *form* property, which contains a link to a form that must be filled to complete the dispute.

*Example:* When using `'onboarding'` feature, you could also get in the query answer a link like this :

```json
[...]
"form": "https://app.staging.justice.cool/form/01DFKD490BADBC4FS95SH5RA16"
``` -->


?> Please head to [the playground](/playground.md) to inspect detailed schema information and documentation.


# "Facts" and how to fill them

You may have noticed in the example above that you have to fill "facts", which are all the facts/variables/elements about your dispute, including the various documents.  It looks like:

```json
[
    { "variable": "age", "answer": 35 },
    { "variable": "country", "answer": "France" }
]
```

If you want to leverage justice.cool modelisation, you should provide justice.cool variables.
A complete list of our existing variables [can be found here](/known-variables.md).
To know which variables you should send for a specific litigation, contact us.


Variables are facts that will be discussed one by one during the mediation process with the opponent. As such, the "variables" you provide here are only *your version* of the facts, which the opponent will be able to challenge.

?> Each fact has its own type. Check the [existing variables](/known-variables.md) for details.

?> `Document` are variables which are a bit special, check the [Upload documents](/general/documents.md) section to learn how to upload them.

# "Claims" and when to provide them

Claims are the demands you are asking to your opponent. Claims are either calculated by justice.cool system based on the facts provided, or given manually.

Claims can be of two types:
- monetary: the demand is a compensation, with a specified amount
- service: the demand is the execution of a service / reparation, within a specified deadline.


Once all facts have been discussed and negociated between you and your opponent, you will have to discuss the claims (the amount or the delay), and negociate them in order to find an amicable solution.


You can **optionnaly** manually specify claims for each demander. Doing so, you can enforce justice.cool to take claims into account that might not have been created automatically (when updateMode: auto).

To better understand how claims are created and later updated during mediation, you have to understand 3 parameters:

- When creating the dispute, you specify a global parameter `updateMode`: It defines how "automatic" claims are created and deleted during the mediation.
- Additionaly, you can provide two options on each claim you create manually:
    * `eligibilityMode`: It overrides the global `updateMode` for the given claim, thus defining if justice.cool is in charge of creating/deleting this claim when needed.
    * `compensationMode`: It tells justice.cool how the amount of this claim must be computed.

In each case, setting a parameter to "manual" means that **justice.cool will not delete or update the claims automatically**.

?> If you use `updateMode: manual`, then you **must** specify claims manually.

?> When `updateMode` mode is not "manual", if you dot not provide any specific claim, then justice.cool will automatically compute them based on the "variables" you provided.

This mechanism gives you a wide range of options to handle your claims, from completely automatic to completely manual. We will review below a couple of common use cases.


## Completely custom claims


You can create completely custom claims, which justification will be opaque to justice.cool (thus also possibly opaque to your opponent).
This might be usefull for one-time or very specific litigations types which you know very well about, or that are not well handled by justice.cool in your opinion (by the way, do not hesitate to tell us more about them so we can improve justice.cool !).

On another hand, such claims will not be scored, nor updated automatically by justice.cool.

For instance, the request below creates a new dispute with only two custom claims (and no variable data).


```playground
==> height tall
==> fullpage
==> schema
==> variable opponent
{
    company: { identifier: 'siret:80314744600022' },
    contactMeans: [
        { auto: true }
    ]
}

==> gql
mutation CreateDispute($opponent: OpponentInput!) {
  createDispute(
    data: {
      # see above for those
      features: [letMeCheckBeforeSending]
      startAt: mediation
      signatureMode: auto
      variables: []
      opponent: $opponent
      # to only take manual claims into account
      updateMode: manual
      # who is the demander of this dispute
      demanders: [
        {
          # in this case, this means that the demander is a person that has mandated your company for this dispute.
          # ... if your company is the demander, then leave this blank.
          person: { firstName: "Perh", lastName: "Sohn" }
          # Claims for this demander
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

```

!> It might not be a good idea to push this kind of raw custom claims without variables: you should also push variables, which represent facts that will be discussed between you and your opponent. Without those, you have little material to discuss/negociate on in order to help you find an amicable solution.

## Claims scored by justice.cool, with custom amount

If you want your claims to be "scored" by justice.cool, you **must** provide on your custom claims a "typeId" that matches a [justice.cool type of claim](/known-variables.md#claim-types).

These claims have been modelized by our jurists and our data scientists and for which an indicative score can be provided, based on the word of law, and on machine learning algorithms that will analyze past decisions of cases similar to yours.

?> Scores are updated each time you negociate a fact with your opponent during the mediation process. It is an indicative score which relies on our jurists understanding of your dispute, and on machine learning algorithms.

# Determine the opponent

You may have noticed in the example above that you have to fill the `opponent` variable.

### If the opponent is a company

You can specifiy this company using :
- the SIRET identifier : in the format `'siret:0123456789'`
- the id from our company database. To simplify opponent designation and to enrich the database with companies that are not registered in France, we store a list of brands in our database (for instance, airline companies, travel agencies etc).
You can search for these companies in the [Companies](/dev-tools/companies) section.

If you want to provide the contact means for the opponent, you can specify them in the `contactMeans` variable.
In addition, you can also force the contact means to `auto: true` to use the contact means defined in justice.cool database.

### If the opponent is an individual

You have to provide various information (first name, last name) as well as contact means (email, postal address, phone)


# Best practices and useful info

## Handle failures

Often, you will see your calls to `createDispute` fail. It could happen because a file that you uploaded is unreadable, or because some information is missing.

Be prepared for that and implement some kind of "fix-and-retry" mechanism which could for instance call for human attention before retrying.

!> When a call fails, read the resulting error message. It often contains a clear explanation of why your call has failed.

## Be flexible

The justice.cool modelization is highly flexible.
It means that the variables required to evaluate two similar cases could not exactly be the same.

?> Example: When filing an aerial litigation (delayed plane), if the passenger is underage, then justice.cool will ask you for some information to prove that you are legaly responsible for this passenger.
But this document will not be asked most of the time (for adult passengers).

In short, you should not assume to always perfectly know which data to send.

You could surely see this to be hard constraint, but leveraging justice.cool modelization can bring you and your opponent:

- A justice.cool score which helps both parties to evaluate the situation.
- Logical explanations telling how the claim amounts have been computed, and why you are entitled to them.
- A well formated and complete file which does not miss any piece of information.
