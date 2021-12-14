# Introduction

[Justice.cool](https://justice.cool) is an online platform which digitizes the judicial process and help legal professionals to scale their expertise.

It offers all access, features and services simplifying dispute management and the discussion between involved parties  from the claim to the enforcement of the court decision.

The professionals (lawyers, claim agencies, associations...) as well as their clients have access to the file at the same place, and they are able to invite on the dispute all other necessary representatives (bailiff, court clerk, opponent lawyer, applicant lawyer ...).

# READ ME FIRST !

Feel free to start hacking our api right away and to quick-read through this documentation. However, Justice.cool is functionally complex. We thus strongly recommand you to:

1) Read this page, in order to get a small overview of our flow.

2) Understand how this documentation is organized.

3) Find and follow the tutorial that matches your use case: it will guide you through your implementation step by step.

?> This documentation [is open-source](https://github.com/oguimbal/jcool-docs). You are more than welcome to create pull requests to help us improve it.

# Who can use Justice.cool API ?

Justice.cool API is meant for multiple types of actors, to allow them to connect to our services:

### Demander companies

If you are a company often involved in conflicts with individuals or other companies, Justice.cool allows you to push new disputes directly from your IT systems or your CRM.

The system is not invasive and lets you choose exactly which functionality you want to use in order to preserve your branding, while ridding you of the complexity of dealing with human interactions.


### Opponent companies

If you are a company and would like to ease your users griefs and help them resolve their issues with you, Justice.cool allows you to connect your IT systems in order to be notified if someone has a litigation with your company.

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