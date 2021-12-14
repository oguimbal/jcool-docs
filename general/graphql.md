# GraphQL a brief introduction

GraphQL (for "Graph Query Language") was developed by Facebook to address the lack of flexibility of REST APIs. GraphQL is particularly powerful for:
- Flexibly expose complex APIs without over-fetching
- Self-document an API, and solve documentation obsolescence problems
- Explore unknown APIs in an agile and fun way
- Uniformity of conventions between different APIs, and help in the development of micro-services.
- Close the Server → Client typing chain, and develop end-to-end type-safe applications.

Typically, a GraphQL API consists of a single HTTP address (for our staging API, this is https://api.staging.justice.cool/v1) that responds to POST requests.

In order to simplify development, navigating to the API address with a browser (i.e. making a GET request) displays a request editor : [the "playground"](/playground.md).

The text of the requests you create (in [the playground](/playground.md), for example) will have to be put in the body of the POST requests you will make to the api, which will then answer you in a JSON format that "looks" like the format defined in your request.


!> The HTTP headers should be specified in a tab, next to "Query Variables". You will have to specify your API key in the form {"Authorization": "Bearer YOUR API KEY"} in order to authenticate yourself to our api (and the same header should be specified in your POST requests).

!> **This is optional (you can stay with POST and pure JSON documents)**, but depending on the technology you are using, it is likely that tools are available to automatically generate the types corresponding to the requests you will create. For example https://www.graphql-code-generator.com/ supports a number of technologies.

# Queries VS Mutations
GraphQL can be queried in two ways:
- queries
- mutations

Both are relatively similar. The only difference is that a **query will never influence data**, it will always be a read (so you can try to execute any query with confidence without fear of side effects).

Conversely, **mutations are designed to act on data**.

We differentiate a query from a mutation with the prefix of the edited text

Example of a query:
```graphql
query { dispute (id: "CFR-XXX") { link }
```

Example of a mutation:
```graphql
mutation { dispute(id: "CFR-XXX") { processAction(action: closeDispute) } }
```

NB: The term "query" is optional. If it is not present, the request is a "query" by default.

# Parameters

When exploring the API, you will probably "hard-code" identifiers.
However, when you want to turn this into a "real" request and protect yourself from injection problems, you will need to parameterize your request:

```graphql
query { dispute (id: "CFR-XXX") { link }
```

Will then become:
```graphql
query SomeName($did: String!) { dispute (id: $did) { link }
```

And then it will be expected that you post to the API something in the form:
```graphql
{
   "query": "query SomeName($did: String!) { dispute (id: $did) { link } }",
   "variables": { "did": "CFR-XXXX" }
}
```

NB: "SomeName" is used by some libraries that do intelligent caching. If you don't use it, you can put anything, like an explicit name.
