# Mediation service

This section contains information on justice.cool flagship service : the 1st AI assisted mediation service.

Below is a description of the mediation process initated by a user via the form. The API can automate most of the steps, but it is quite important to understand the the sequence of the different phases.


# From the user perspective

To our customers (those who land directly on [Justice.cool](https://justice.cool) to solve their problems), we offer several distinct services that are streamlined in a unique coherent experience:

### User guidance (dispute creation via the form)
Users will be guided through a form that helps them to identify what they are entitled to, and why.

Jurists from Justice.cool team have modelized laws that are most comonly involved in small litigations.
Thus, the platform will be able to compute the claims the user might be entitled to.

At the end of the form, a complete file is established. Each answer from the form is stored as a variable, including all the documents. (This can be a huge gain of time for lawyers who may have to handle the case later, after the mediation)

Our algorithms are also coupled with machine learning technologies which analyze millions of cases similar to the new case, in order to compute an indicative score which will help both parties to better understand the case.

### Opponent contact

When the opponent is a company, most of the time Justice.cool knows how to contact the company.
Justice.cool will take care of contacting his opponent, by the mean that is most suitable for his dispute type.

When the opponent is an individual, the user is asked how the opponent can be contacted.

### Negociation

Justice.cool offers a frame which helps both parties to negociate peacefully the terms of an amicable solution. They can make some propositions and counter-propositions until they find an agreement or the end of the mediation delay.


### Prosecution

<!--If unluckily both parties fail to settle on an amicable solution, justice.cool will help lawyers to take the case in front of a court.

Justice.cool will prepare them a well formated file containing all information for both parties (which will never include details about the mediation negociation).

They will also be offered tools to help them to communicate with you securely, and to keep you posted of changes or news about your case. -->

If unluckily both parties fail to settle on an amicable solution, Justice.cool will generate a document that proves the mediation failure.
This document will enable the demander to go to court.


# Usual lifecycle of a dispute

```sequence-diagram
Title: A successful mediation lifecycle
Demander -> justice.cool : Create new dispute
Note over justice.cool : Files verification
justice.cool -> Opponent : Contact (mel, postal, ...)
Note over Opponent : Chooses to start mediation
Opponent -> justice.cool : Reviews & corrects facts
Demander -> justice.cool : Corrects facts, uploads proof
Opponent -> justice.cool : Accepts / refuses claims
Demander -> justice.cool : Accepts opponent offer
Note over Demander,Opponent: Both parties sign the contract
Opponent -> justice.cool : Pays negociated compensation
Opponent --> Demander : Provides negociated service
Demander --> justice.cool : Confirms service provided
justice.cool -> Demander : Pays the compensation
Note over Demander,Opponent: Dispute is resolved
```

Justice.cool coordinates multiple actors, guiding the user who comes *directly* to Justice.cool in the following process resolution:

- Onboarding step: A "welcome" form guides the user to evaluate which claim(s) he is entitled to
- File checking step: Justice.cool checks that all uploaded documents are readable, and that they are valid.
- Contact step: Justice.cool contacts the opponent and
- Negociation step: A "ping-pong" form gives a chance to the demander and opponent to provide their version of the facts (by turns), and help them to negociate an amicable solution

### If mediation succeeds
- Signature step: both parties must sign (electronically) the mediation agreement which summarize the claims on which both parties have agreed on
- Execution step: Justice.cool checks that the opponent does/pays what both parties have negociated

### If mediation fails
<!-- - Prosecution step: Justice.cool prepares a case for a lawyer who will take it to a judge. Justice.cool follows this process and keeps the user posted of his case evolution.-->
- Justice.cool generates a document that proves the mediation failure

