
Auto-responders are fictive opponents that you can use to test Justice.cool API.

When setting an auto-responder as your opponent, it will automatically interact with you using a predefined behaviour (which depends on the autoresponder you chose).

They might be useful when testing the API to emulate real opponents.


?> Auto-responders are opensource, and developed using our public API. You can check their source [here](https://gitlab.com/justice.cool/autoresponders), which could also give you hints on how to implement your own automatic behaviours. Moreover, you are more than welcome to contribute to this repository by suggesting new auto-responders.

To use an auto-responder, just use the below autoresponder codes as company identifier.

!> Auto-responders only exist on the **staging** environment, you cannot use them in prod.

## AR-RANDOM *(Randomly negociates)* {docsify-ignore-all}

This auto-responder will:

- Randomly negociate facts
- Randomly negociate claims

?> Source can be found [here](https://gitlab.com/justice.cool/autoresponders/-/blob/master/src/auto-reponders/negociate-random.ts)

## AR-ACCEPT *(Accepts everything)* {docsify-ignore-all}

This auto-responder will accept everything you say.

If you push him a new dispute, it will accept your conditions and your claims right away, and the mediation will end.

?> Source can be found [here](https://gitlab.com/justice.cool/autoresponders/tree/master/src/auto-reponders/accepts-all.ts)

## AR-REJECT-CLAIMS *(Rejects all claims)*

This auto-responder wil accept every fact, but will refuse all claims.

Thus, if you push him a new dispute, mediation will directly fail (because the fake opponent has refused all negociation without counter-proposal).


?> Source can be found [here](https://gitlab.com/justice.cool/autoresponders/tree/master/src/auto-reponders/rejects-claims.ts)