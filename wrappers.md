# All technologies

Justice.cool offers a GraphQL api, which is compatible with all technologies.

To find the proper GraphQL client for you, head to [this list](https://github.com/chentsulin/awesome-graphql) (it contains tons of resources, but beware, you need a GraphQL **client**, not a server).

However, we maintain a list of wrappers of our GraphQL endpoint for most popular technologies.

!> Wrappers only expose a subset of what you can do with the GraphQL api:
They provide an easier way to perform the most common operations. See [wrappers source code](https://gitlab.com/justice.cool/api-wrappers).

# Node.js

There is a [simple wrapper](https://www.npmjs.com/package/@justice.cool/api-wrapper) for Javascript/Typescript:

## Installation
```bash
npm i @justice.cool/api-wrapper --save
```

## Usage

```typescript
import {JCoolApi} from '@justice.cool/api-wrapper';
// install this package if you want to perform custom GraphQL queries
import gql from 'graphql-tag';

(async () => {

    // create api instance
    const api = new JCoolApi('<MY API KEY>', {
        // implement hooks you intend to support here
        async newDispute({disputeId}) {
            // do something
        }
    });

    // random examples
    const disputeId = await api.createDispute({ /* new dispute data here */ })
    const disputeDetails = await api.getDispute(disputeId).getDetails();

    // custom GraphQL query
    const data = await api.client.get(gql`<my graphql query>`);
})()
```
# Coming soon
- Python
- C#/.Net
- Java

Tell us if you need one of them.


Do not hesitate to give us feedback if you would like another technology to be supported.