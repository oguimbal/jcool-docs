# Document variables

Some variables you will be asked for are documents.

Justice.cool supports these file mime types:
 - Images `image/png` or `image/jpeg` or `image/bmp`
 - PDF files `application/pdf`
 - Word .docx files `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

You have multiple options to send them.

# Option 1: Give us a download URL

You can provide an answer in the form of an http(s) url:
```json
[
    { "variable": "iDCard", "answer": "https://myhost.com/path/to/file" },
]
```

In which case, justice.cool will expect to find the document at this address.
It will require:

- This url to respond to a GET request
- This url to be fully authentified (i.e. justice.cool will not send any cookie)
- Justice.cool will expect this url to send the `Content-Type` response header which tells which kind of document this file is (via its mime type) - most static storage types support this natively.

?> All your files will be compressed and converted to PDF.

!> When sending heavy documents or many of them (especially docx documents, which are heavy to convert), the GraphQL call to `createDispute` can be quite long. In which case you could prefer to upload documents one by one using option 2.

?> This option might not be suitable for localhost development.

?> If you wish to give us authenticated (not public) urls, know that most storage providers (aws s3, azure blob storage, swift, ...) provide mechanisms to create `pre-signed urls` which create temporarily public urls. If you use a custom storage, you could sign your urls using a jwt, for instance.

# Option 2: Pre-upload each documents in a single file

You can pre-upload each document via an http `POST` to `https://api.justice.cool/v1/upload`  (or `https://api.staging.justice.cool/v1/upload` for the dev environment).

This POST expects:
- A binary body which is the content of your document
- The document mime type in the `Content-Type` header

It will return a raw body (string) containing a reference that you can pass as an answer to your variable.

?> The uploaded document reference should look like `temp:XXXXX`

!> An uploaded document reference can be used multiple times in a **single** call to `createDispute`, but it cannot be reused later.

# Option 3: Pre-upload each documents in multiple files

There are cases where you could have two documents (say a `.jpg` and a `.pdf` file), which corresponds to a single document you want to upload.
It turns out that Justice.cool knows how to convert and concatenate documents, just upload your two (or more) files via multiple http `POST`:

1) You can begin a multi-document upload by sending your first file via an http `POST` to `https://api.justice.cool/v1/upload/concat`, which works in the same way as `Option 2`.

2) The first call will give you a reference (example: `upload:xxxxxx`) that can later be used to add additional files via a similar http post to `https://api.justice.cool/v1/upload/concat?id=upload:xxxxxx`

3) Finalize your upload when sending the last file by specifying `finish=true` argument (ex: `https://api.justice.cool/v1/upload/concat?id=upload:xxxxxx&finish=true`)

4) Use the reference returned by this last `POST` as an answer for your document.

Each POST expects:
- A binary body which is the content of your document
- The document mime type in the `Content-Type` header

?> The "intermediary" upload refrence should like `upload:XXXXXX`, while the "final" uploaded document reference should look like `temp:XXXXX`

!> An uploaded document reference can be used multiple times in a **single** call to `createDispute`, but it cannot be reused later.
