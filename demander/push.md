
# Push a new file

You can use the API to push some files you want to handle on the platform. In justice.cool vocabulary, a file is a dispute. You will have access in your personal area to the disputes you have sent through the API. All the parties invited on the dispute will have access too. Parties will be able to do different actions on the file depending on their role.

When creating the dispute, you will be able to choose among optional services to ease the process :

- **Claim computation & Scoring**: this option leverages justice.cool modelization and machine learning algorithms to compute the claims of the file.
- **Onboarding**: in case of opt-in for claim computation & scoring, if some information is missing in what you have sent for the model, you can instruct us to create a form to fill-in this information manually. If you do not opt-in for this feature, then the dispute creation will fail in case of missing information.



# Show me some code

Here is the graphql mutation to push a new dispute to justice.cool.

You can find all the variables description (except for the facts) in the tabs **Docs** and **Schema** in each GraphQL playground on the right side.

The facts are listed in the tab "Query variables."

?> Don't be afraid to run the code below, it will create a dispute on the **staging** environment, which is free, and which does not contact anybody in real life.

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
      # If you specify either "person" or company", then this means that your company has been mandated for their representation.
      # ... if your company is the demander, then leave this blank.
      demanders: [{ person: { firstName: "Perh", lastName: "Sohn" } }]
      # Who is the opponent in this dispute ?
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
    # == if some info is missing, this form must be filled
    form
  }
}

==> wrapper Typescript
await api.createDispute({
      // tells justice.cool to create a form if some info is missing
      features: [JCoolFeature.Onboarding]
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

**Note when** `updateMode: auto`

If some information is missing, the dispute **will** be created (thus, you will have an ID), in a dormant state. But you will also be given the *form* property, which contains a link to a form that must be filled to complete the dispute.

*Example:* When using `'onboarding'` feature, you could also get in the answer above something like this:

```json
[...]
"form": "https://app.staging.justice.cool/form/01DFKD490BADBC4FS95SH5RA16"
```


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

?> Each fact has its own type. Check the [existing variables](/known-variables.md) for details.

?> `Document` are variables which are a bit special, check the [Upload documents](/general/documents.md) section to learn how to upload them.

# "Claims" and when to provide them

Claims are the demands of the dispute. Claims are either calculated by justice.cool system based on the facts provided, or given manually.

Claims can be of two types:
- monetary: the demand is a compensation, with a specified amount
- service: the demand is the execution of a service / reparation, with a specified delay to be executed


[**Optional**]You can manually specify claims for each demander. Doing so, you can enforce justice.cool to take claims into account that might not have been created automatically (when updateMode: auto).

To better understand how claims are created, you have to understand 3 parameters:

- When creating the dispute, you specify a global parameter `updateMode`: It defines how "automatic" claims are created and deleted.
- Additionaly, you can provide two options on each claim you create manually:
    * `eligibilityMode`: It overrides the global `updateMode` for the given claim, thus defining if justice.cool is in charge of creating/deleting this claim when needed.
    * `compensationMode`: It tells justice.cool how the amount of this claim must be computed.

In each case, setting a parameter to "manual" means that **justice.cool will not delete or update the claims automatically**.

?> If you use `updateMode: manual`, then you **must** specify claims manually.

?> If you dot not provide any specific claim, then justice.cool will automatically compute them based on the "variables" you provided (`updateMode` mode is not "manual").

This mechanism gives you a wide range of options to handle your claims, from completely automatic to completely manual. We will review below a couple of common use cases.


## Completely custom claims


You can create completely custom claims, which justification will be opaque to justice.cool (thus also possibly opaque to the opponent).
This might be usefull for one-time or very specific litigations types which you know very well about, or that are not well handled by justice.cool in your opinion (do not hesitate to tell us more about them so we can improve justice.cool !).

On another hand, such claims will not be scored, nor updated automatically by justice.cool.

For instance, the request below creates a new dispute with only two custom claims (and no variable data).


```playground
==> height tall
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
      features: [onboarding]
      signatureMode: auto
      variables: []
      opponent: $opponent
      # tells justice.cool to only take manual claims into account
      updateMode: manual
      # Who is the demander of this dispute ?
      demanders: [
        {
          # In this case, this means that the demander is a person that has mandated your company for this dispute.
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

!> It might not be a good idea to push this kind of raw custom claims without variables : you should also push variables, which represent facts that will qualify the dispute. This will be useful to discuss with the opponent, to generate documents easily ...
## Claims scored by justice.cool, with custom amount

If you want your claims to be "scored" by justice.cool, you **must** provide on your custom claims a "typeId" that matches a [justice.cool type of claim](/known-variables.md#claim-types).

These claims have been modelized by our jurists and our data scientists and for which an indicative score can be provided, based on the word of law, and on machine learning algorithms that will analyze past decisions of cases similar to yours.

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

- A well formated and complete file which does not miss any piece of information.
- Logical explanations telling how the claim amounts have been computed, and why you are entitled to them.
- [In some cases] A justice.cool score which helps both parties to evaluate the situation.
