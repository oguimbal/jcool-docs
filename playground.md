
# API playground

?> Not familiar with GraphQL ? Don't worry, it's deadly simple, and we'll guide you through tutorials. But [you can learn more about it here](https://graphql.org/learn/)


```graphql
# You can try sample requests here, like
{
    disputes {
        name
    }
}
```

<style>
    .gqleditor {
        margin: 0;
        width: 100%;
    }
    .markdown-section {
        max-width: unset !important;
    }
    .gqleditor > div > div  {
        height: 75vh !important;
    }
    
    /* hide docs & schema */
    .graphiql-wrapper>div>div:nth-child(2) {
        display: unset !important;
    }
</style>