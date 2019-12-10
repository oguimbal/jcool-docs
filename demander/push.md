
# Push a new dispute

!> You must read [usual lifecycle of a dispute](/#usual-lifecycle-of-a-dispute) to understand this section

To start a mediation with your opponnent, you have to push some information about your litigation to justice.cool. A new record, called a **dispute**, will then be created in Justice.cool platform.

When creating the dispute, you will be able to choose among optional services to ease the process :

- **Claim computation & Scoring**: this option leverages justice.cool modelization and machine learning algorithms to compute the claims you are entitled to.
- **Onboarding**: in case of opt-in for claim computation & scoring and that some information is missing for the model given what you sent us, you can instruct us to create a form to fill-in this information manually. If you do not opt-in for this feature, then the dispute creation will fail.
- **Contact**: you can choose if you want us to contact the opponent for you (or you will have to contact them yourself - IMPORTANT : see the [terms of use](/tos.md) of our API for this case)

!> We will not perform the "File checking" step described in [usual lifecycle of a dispute](/#usual-lifecycle-of-a-dispute): justice.cool cannot be held responsible for the non validity of the documents you send us.

?> The later steps described in [usual lifecycle of a dispute](/#usual-lifecycle-of-a-dispute) are not (yet) in the scope of our public API: Disputes created though this API will be considered as completed once mediation ends (see "end" hook)

# Show me some code

A bit of code can be worth a thousand lines.

You can find all the variables description in the tabs **Docs** and **Schema** in each GraphQL playground on the right side.

?> Don't be afraid to run the code below, it will create a dispute on the **staging** environment, which is free, and which does not contact your opponent in real life.

```playground
==> height very-tall
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
      demanders: [{ person: { firstName: "Perh", lastName: "Sohn" } }]
      // Who is the opponent in this dispute ?
      opponent: {
        // opponent is a company: must be identified using SIREN
        company: { country: Country.France, identifier: "80314744600022" }
        // when opponent is a company, contact means are optional
        contactMeans: [
          // you can specify this to tell justice.cool to also contact company as it is used to
          { auto: true, mode: ContactMode.Free }
          // specifying this, justice.cool will also send a "recommandé électronique" to this address to contact them:
          { email: "perh.sohn@nobody.com", mode: ContactMode.Premium }
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
- a dispute will be created in Justice.cool
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

The id returned in the response is in the form "CFR-YYYYMMDD-xxx" where YYYYMMDD is the actual date and xxx is a 3-character chain.

**Note when** `updateMode: auto`

If some information is missing, the dispute **will** be created (thus, you will have an ID), in a dormant state. But you will also be given the *form* property, which contains a link to a form that must be filled to complete the dispute.

*Example:* When using `'onboarding'` feature, could also get in the answer above something like this:

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

If you want to leverage justice.cool scoring, variables that you provide must match justice.cool variables.
A complete list of our existing variables [can be found here](/known-variables.md).


Variables are facts that will be discussed one by one during the mediation process with the opponent. As such, the "variables" you provide here are only *your version* of the facts, which the opponent will be able to challenge.

## Document variables

Some variables you will be asked for are documents.

Justice.cool supports these file mime types:
 - Images `image/png` or `image/jpeg` or `image/bmp`
 - PDF files `application/pdf`
 - Word .docx files `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

You have multiple options to send them:

### Option 1: Give us a download URL

You can provide an answer in the form of an http(s) url:
```json
[
    { "variable": "iDCard", "answer": "https://myhost.com/path/to/file" },
]
```

In which case, justice.cool will expect to find the document at this address.
It will require:

- This url to respond to a GET request
- This url to be fully authentified (i.e. justice.cool will not send any cookie)
- Justice.cool will expect this url to send the `Content-Type` response header which tells which kind of document this file is (via its mime type) - most static storage types support this natively.

?> All your files will be compressed and converted to PDF.

!> When sending heavy documents or many of them (especially docx documents, which are heavy to convert), the GraphQL call to `createDispute` can be quite long. In which case you could prefer to upload documents one by one using option 2.

?> This option might not be suitable for localhost development.

?> If you wish to give us authenticated (not public) urls, know that most storage providers (aws s3, azure blob storage, swift, ...) provide mechanisms to create `pre-signed urls` which create temporarily public urls. If you use a custom storage, you could sign your urls using a jwt, for instance.

### Option 2: Pre-upload each documents in a single file

You can pre-upload each document via an http `POST` to `https://api.justice.cool/v1/upload`  (or `https://api.staging.justice.cool/v1/upload` for the dev environment).

This POST expects:
- A binary body which is the content of your document
- The document mime type in the `Content-Type` header

It will return a raw body (string) containing a reference that you can pass as an answer to your variable.

?> The uploaded document reference should look like `temp:XXXXX`

!> An uploaded document reference can be used multiple times in a **single** call to `createDispute`, but it cannot be reused later.

### Option 3: Pre-upload each documents in multiple files

There are cases where you could have two documents (say a `.jpg` and a `.pdf` file), which corresponds to a single document you want to upload.
It turns out that Justice.cool knows how to convert and concatenate documents, just upload your two (or more) files via multiple http `POST`:

1) You can begin a multi-document upload by sending your first file via an http `POST` to `https://api.justice.cool/v1/upload/concat`, which works in the same way as `Option 2`.

2) The first call will give you a reference (example: `upload:xxxxxx`) that can later be used to add additional files via a similar http post to `https://api.justice.cool/v1/upload/concat?id=upload:xxxxxx`

3) Finalize your upload when sending the last file by specifying `finish=true` argument (ex: `https://api.justice.cool/v1/upload/concat?id=upload:xxxxxx&finish=true`)

4) Use the reference returned by this last `POST` as an answer for your document.

Each POST expects:
- A binary body which is the content of your document
- The document mime type in the `Content-Type` header

?> The "intermediary" upload refrence should like `upload:XXXXXX`, while the "final" uploaded document reference should look like `temp:XXXXX`

!> An uploaded document reference can be used multiple times in a **single** call to `createDispute`, but it cannot be reused later.

# How do I fill "claims" ?

Claims are the demands you are asking to your opponent.
Claims can be of two types:
- monetary: the demand is a compensation, with a specified amount
- service: the demand is the execution of a service / reparation, within a specified deadline

Once all facts have been discussed and negociated between you and your opponent, you will have to discuss the claims (the amount or the deadline), and negociate them in order to find an amicable solution.


You can **optionnaly** manually specify claims for each demander. Doing so, you can enforce justice.cool to take claims into account that might not have been created automatically (when updateMode: auto).

To better understand how claims are created and later updated during mediation, you have to understand 3 parameters:

- When creating the dispute, you specify a global parameter `updateMode`: It defines how "automatic" claims are created and deleted during the mediation.
- Additionaly, you can provide two options on each claim you create manually:
    * `eligibilityMode`: It overrides the global `updateMode` for the given claim, thus defining if justice.cool is in charge of creating/deleting this claim when needed.
    * `compensationMode`: It tells justice.cool how the amount of this claim must be computed.

In each case, setting a parameter to "manual" tells justice.cool: *dont delete or update this automatically, i'm in charge of it !*.

?> If you use `updateMode: manual`, then you **must** specify claims manually.

?> If you dot not provide any specific claim, then justice.cool will automatically compute them based on the "variables" you provided (`updateMode` mode is not "manual").

This mechanism give you a wide range of options to handle your claims, from completely automatic to completely manual. We will review below a couple of common use cases.


## Completely custom claims


You can create completely custom claims, which justification will be opaque to justice.cool (thus also possibly opaque to your opponent).
This might be usefull for one-time or very specific litigations types which you know very well about, or that are not well handled by justice.cool in your opinion (by the way, dont hesitate to tell us more about them so we can improve justice.cool !).

On another hand, such claims will not be scored, nor updated automatically by justice.cool.

For instance, the request below creates a new dispute with only two custom claims (and no variable data).


```playground
==> height tall
==> variable opponent
{
    company: { country: 'france', identifier: '80314744600022' },
    contactMeans: [
        { auto: true, mode: 'free' }
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

```

!> It might not be a good idea to push this kind of raw custom claims without variables: You should also push variables, which represents facts that will be discussed between you and your opponent. Without those, you have little material to discuss/negociate on in order to help you find an amicable solution.

## Claims scored by justice.cool, with custom amount

If you want your claims to be "scored" by justice.cool, you **must** provide on your custom claims a "typeId" that matches a [justice.cool type of claim](/known-variables.md#claim-types).

These claims have been modelized by our jurists and our data scientists and for which an indicative score of your probability of success in court can be provided, based on the word of law, and on machine learning algorithms that will analyze past decisions of cases similar to yours.

?> Creating "scored" claims might help you and your opponent to evaluate your legitimity. Scores are updated each time you negociate a fact with your opponent during the mediation process. It is an indicative score which relies on our jurists understanding of your dispute, and on machine learning algorithms.


# Best practices and useful info

## Handle failures

Often, you will see your calls to `createDispute` fail. It could happen because a file that you uploaded is unreadable, or because some information is missing.

Just be prepared for that, and implement some kind of "fix-and-retry" mechanism which could for instance call for human attention before retrying.

!> When a call fails, read the resulting error message ! It often contain a clear explanation of why your call failed.

## Be flexible

The justice.cool modelization is highly flexible.
It means that the variables that will be required to evaluate two similar cases could not exactly be the same.

?> Example: When filing an aerial litigation (delayed plane), if the passenger is minor, then justice.cool will ask you for some information to prove that you are legaly responsible for this passenger.
But this document will not be asked most of the time (for major passengers).

In short, you should not assume to always perfectly know which data to send.

The surely could seems to be constraint, but leveraging justice.cool modelization can bring you and your opponent:

- A justice.cool score which helps both parties to evaluate the situation.
- Logical explanations telling how the claim amounts have been computed, and why you are entitled to them.
- A well formated and complete file which does not miss any piece of information.
