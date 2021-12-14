# Invite and involve other parties

You can use the API to invite parties on the dispute. Parties will be able to do different actions on the file depending on their role.

## Invite a lawyer on a dispute


```playground
==> fullpage
==> schema
==> variable disputeId
"CFR-XXXXXXX-XXXX"

==> gql
mutation InviteLawyer($disputeId: String!) {
  dispute (id: $disputeId) {
    performAction(
        action: inviteDemanderLawyer,
        data: {
            # The identifier of the lawyer to onboard (identifier chosen by the lawyer)
            id: "jcooltests",
            # The fee agreement signed by the demander (see Upload documents)
            lawyerFeeAgreement: "temp:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            # Notes for the lawyer...include hashtags to help
            notes: "Dossier de #Source",
        })
  }
}

==> wrapper Typescript
const dispute = this.api.getDispute('CFR-XXXXXXX-XXX');

```