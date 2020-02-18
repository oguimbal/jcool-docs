# Justice.cool

[Justice.cool](https://justice.cool) is a fully online mediation platform that helps people and companies to resolve their disputes.

# READ ME FIRST !

Feel free to start hacking our api right away and to quick-read through this documentation. However, Justice.cool is functionally complex. We thus strongly recommand you to:

1) Read this page, in order to get a small overview of our flow.

2) Understand how this documentation is organized.

3) Find and follow the tutorial that matches your use case: it will guide you through your implementation step by step.

?> This documentation [is open-source](https://github.com/oguimbal/jcool-docs). You are more than welcome to create pull requests to help us improve it.

# Justice.cool, from the user perspective

To our customers (those who land directly on [Justice.cool](https://justice.cool) to solve their problems), we offer several distinct services that are streamlined in a unique coherent experience:

### User guidance
Users will be guided through a form that helps them to identify what they are entitled to, and why.

At the end of this process, a complete file will be constituted, which could be a huge gain of time for lawyers who may have to handle the case.

To do so, Justice.cool jurists have modelized laws that are most comonly involved in small litigations.
Thus, the platform will be able to compute the claims the user might be entitled to.

Our algorithms are also coupled with machine learning technologies which analyze millions of cases similar to yours, in order to compute an indicative score which will help both parties to better understand the case.

### Opponent contact

When the opponent is a company, most of the time Justice.cool knows how to contact them. The user will not have to understand the arcana of the company he is opposed to.
Justice.cool will take care of contacting his opponent, by the mean that is most suitable for his dispute type.

### Mediation

Justice.cool offers a frame which helps both parties to negociate peacefully the terms of an amicable solution.


### Prosecution

<!--If unluckily both parties fail to settle on an amicable solution, justice.cool will help lawyers to take the case in front of a court.

Justice.cool will prepare them a well formated file containing all information for both parties (which will never include details about the mediation negociation).

They will also be offered tools to help them to communicate with you securely, and to keep you posted of changes or news about your case. -->

If unluckily both parties fail to settle on an amicable solution, Justice.cool will generate a document that proves the mediation failure. 
This document will enable parties to continue the judicial proceeding.  


# Usual lifecycle of a dispute

```sequence-diagram
Title: A successful mediation lifecycle
Demander -> justice.cool : Create new dispute
Note over justice.cool : Files verification
justice.cool -> Opponent : Contact (mel, postal, ...)
Note over Opponent : Chooses to start mediation
Opponent -> justice.cool : Review & correct facts
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

- Onboarding step: A "welcome" form guides the user to evaluate what he is entitled to
- File checking step: Justice.cool checks that all uploaded documents are readable, and that they are valid.
- Contact step: Justice.cool contacts the opponent to invite him to find an amicable solution
- Mediation step: A "ping-pong" form gives a chance to the demander and opponent to provide their version of the facts (by turns), and help them to negociate an amicable solution

### If mediation succeeds
- Signature step: both parties must sign (electronically) the mediation agreement which summarize the claims on which both parties have agreed on
- Execution step: Justice.cool checks that the opponent does/pays what both parties have negociated

### If mediation fails
<!-- - Prosecution step: Justice.cool prepares a case for a lawyer who will take it to a judge. Justice.cool follows this process and keeps the user posted of his case evolution.-->
- Justice.cool generates a document that proves the mediation failure.


# Who can use Justice.cool API ?

Justice.cool API is meant for multiple types of actors, to allow them to connect to our services:

### Demander companies

If you are a company often involved in conflicts with individuals or other companies, Justice.cool allows you to push new disputes directly from your IT systems or your CRM.

Justice.cool will take care of the details, will contact your opponents, and will enable you to mediate your issues.

The system is not invasive and let you choose exactly which functionality you want to use in order to preserve your branding, while ridding you of the complexity of dealing with human interactions.


### Opponent companies

If you are a company and would like to ease your users griefs and help them resolve their issues with you, Justice.cool allows you to connect your IT systems in order to be notified if someone wants to start a mediation with your company.

You will be able to completely connect (or even automate) the dispute resolution via your IT sytems, in order to achieve better user satisfaction, at lower costs.

### Lawyers

You might also be a lawyer firm, with a custom IT system, and you would like to connect it to Justice.cool to keep your customers posted of changes in their case.

<!--
### Risk financing actors

In order to guarantee Justice.cool impartiality, the retribution of our mediation service must not depend on the mediation outcome (so that we are not tempted to influence one of the two parties).

However, we believe that Justice should also be accessible for those who do not have the time nor the funds to invest in a lawsuit, not being sure of its outcome.

In order to keep ustice.cool services "free" for users (i.e. taking cases on a no win - no fee basis), we encourage financing actors to connect to justice.cool APIs.

They will be given the chance to finance mediations of users based on the score we compute. If they do so, and the mediation ends successully, or is judged by a court in favor of the demander, they will be entitled to a percentage of the wins (thus covering their initial investment).
 -->

<!--


If you are using this API, you can opt-in to the steps:
- Onboarding: will only be opt-in on your side, to collect missing information (if you chose an "auto" mode, see 'auto' property description)
- Contact: Once the dispute is created, you can choose whether if you want us to contact the opponent for you (or you will have to contact them yourself - IMPORTANT : see the terms of use of our API for this case)

However, we will not perform the "File checking" step: justice.cool cannot be held responsible for the non validity of the documents you send us.

The "mediation" step is not optional, indeed.

The later steps are not (yet) in the scope of our public API: Disputes created though this API will be considered as completed once mediation ends (see "end" hook)

!> Error
?> Tip

 -->