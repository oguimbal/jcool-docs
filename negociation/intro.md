# Introduction to ping-pong forms

When you and your opponent are involved in a mediation, you will have to interact in order to find an agreement.

When using Justice.cool *manually*, this interaction is performed using several forms that each party will have to fill on a per-turn basis.

As these forms are quite the same if you are a demander or a defender, and given that you have to fill them in turn, we nicknamed them `ping-pong` forms.

These forms are split into two different parts.

## Facts

First, both parties will have to agree on the facts involved in this dispute.
They will have to review and negociate them in turn, until they find an agreement on what the facts are.

Each time someone *reviews* a fact, he may be given the following choices:

- **Give a new version**: if the current fact value does not seem OK, and the person wants to give his point of view.
- **Ask for a correction**: if the current value is wrong. This will ask the opponent to correct this fact.


On each review, it is likely that the claims will be modified in some way:

- Claimed amounts may change (if a fact that has been used to compute those amounts has been changed)
- Claim scores may change (depending on the facts, some facts may directly or remotely influence claim scoring)
- Some claims may be removed or added (if justice.cool has detected a change in the described situation, and the demander changes his/her claims).

?> Each time you review a fact, you will be able to include comments and/or documents to give some arguments to your opponent.

## Claims

Once both parties have settled on an accepted version of facts, they will have to agree on the claims formulated by the demander.

The process is similar to what happened with facts negociation: each party will have to tell what seems reasonable, until an agreement is found.

Each time a claim is reviewed, there will be three options:

- **Ask opponent to abandon a claim**: This will ask the opponent if he would accept to drop this claim.
- **Renegociate claim**: You could negociate amounts or service delays using this option.
- **Accept claim**: This will tell Justice.cool that both parties found an agreement on the given claim.

?> Each time you negociate a claim, you will be able to include comments and/or documents to give some arguments to your opponent.


## Example

Here is a schematic example of what could happen.

Given the facts:
- `salary` = 3000 €
- `seniority` = 3 years

The demander has asked for:
- `Severance package` = `salary * seniority` = 9000 €
- `Bonus` = 500 €
- `Letter of excuse`: A service to be performed within 3 weeks after agreement.

```sequence-diagram
Note over Defender : Accepts fact "seniority"
Note over Defender : Corrects fact "salary=2900 €"
Defender -> Demander : Claim "Severance" changed to 8700€
Note over Demander : Takes note of the claim change
Note over Demander : Accepts salary correction
Demander -> Defender : Found an agreement on facts => time to review claims !
Note over Defender : Negociates "Severance" claim to 8000€
Note over Defender : Asks to drop "Bonus" claim
Note over Defender : Accepts "Letter of excuse" claim
Defender -> Demander : Demander's turn to review counter-proposals
Note over Demander : Accepts "Severance" claim
Note over Demander : Renegociates "Bonus" claim to 200€
Demander -> Defender : Defender's turn to review counter-proposals
Note over Defender : Accepts "Bonus" claim
Note over Defender,Demander: An agreement has been found !
```


## What's next ?

In the next parts, we will see how to automate parts or the entire negociation process.


?> When automating Justice.cool negociations, you do not have to automate **ALL** of this process (which can be complicated in some cases).
    You can implement simple scenari, and fallback on human assistance filling corresponding `ping-pong` forms when a situation is out of the scope of your negociation algorithm.