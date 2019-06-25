
# Push a new dispute

!> You must read [usual lifecycle of a dispute](/#usual-lifecycle-of-a-dispute) to understand this section

When you have a new dispute, you will have to push information about it so justice.cool can start a mediation with your opponent.

Justice.cool also provides optional services to ease the process, which are opt-in when creating the dispute:

- **Scoring & auto claim computation**: Leverages justice.cool modelization and machine learning algorithms to compute the claims you are entitled to.
- **Onboarding**: If you opted in for scoring & claim computation, and that we detect that information is missing among what you sent us, then you can instruct us to create a form to fill-in this information manually. If you do not opt-in for this feature, then the dispute creation will fail.
- **Contact**: Once the dispute is created, you can choose whether if you want us to contact the opponent for you (or you will have to contact them yourself - IMPORTANT : see the [terms of use](/tos.md) of our API for this case)

!> We will not perform the "File checking" step: justice.cool cannot be held responsible for the non validity of the documents you send us.

?> The later steps described in [usual lifecycle of a dispute](/#usual-lifecycle-of-a-dispute) are not (yet) in the scope of our public API: Disputes created though this API will be considered as completed once mediation ends (see "end" hook)

# Show me some code

```graphql
hello! 
```
?> Please head to [the playground](/playground.md) to inspect detailed schema information and documentation.



```graphql
world
```