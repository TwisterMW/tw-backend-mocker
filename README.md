# @tw/backend-mocker

@tw/backend-mocker is a Node/Express application to easily mock responses for a given endpoint in order to be able to focus on Frontend Development without depending on backend implementation nor environment initialization.

## Installation

This package needs to be installed as a **global** dependency to be usable from anywhere and any project.

Once you have the registry set up, you can install the package globally by running:
```npm install -g tw-backend-mocker```

## Environment configuration

Once you have the package installed you must ensure that the npm path on your operative system is properly added to PATH environment variable value. To check the value of our npm path we can run:
```npm config get prefix```

The value returned is what needs to be appended on PATH env. variable value.

## Using the library

To execute the backend mocker you just run `backend-mocker` on your terminal and it will output the parameters documentation.

### Parameters

- e (required): Base endpoint to mock response from
- p {default: 6000}: Port to run the backend mocker on
- f {default: ".backend-mocks"}: Custom folder to get the endpoints from
- u {default: "http://localhost:3000"}: Custom base URL to enable CORS to

### Mock definition

You need to declare your mocks under the .backend-mocks/index.js file (or under your custom folder if you passed the -f parameter) like so:

```js
module.exports = {
    mocks: [
        {
            url: "/user",
            method: "GET",
            status: 200,
            response: { data: [] }
        }
    ]
}
```

As you can see, you can declare as many endpoints as needed under the mocks array.
