# rage

:package: Toolkit for building faster applications using React + ApolloGraphQL + Express + Docker

* :boom: Full server side rendering (SEO friendly)
* :sparkles: Server & client page routing
* :zap: GraphQL queries that renders on server are cached to be used on client
* :lipstick: :wrench: Initial styles/Webpack configs: React Babel + SASS + Normalize.css
* :rocket: :whale: Dockerfile (and configs for https://zeit.co/now) prepared for deploy

:white_check_mark: Demo page: https://rage.now.sh/


## installation

* clone the repository

* go to root folder and run `yarn install` or `npm install` to install dependencies

## preparing back-end

this toolkit is using Graphcool as a backend-as-a-service. It provides faster a brand new GraphQL API generated from defined types and functions. (more info: https://www.graph.cool/)

* install Graphcool using `npm install -g graphcool`

* go to `server/` and run `graphcool init graphcool-service` to create a new Graphcool service

inside `graphcool-service/`, define your GraphQL data schema on `types.graphql` (*if necessary, write functions on `graphcool.yml`*)

* this example is using the data schema below. So, you should copy it and insert into `types.graphql`:

```
type User @model {
  id: ID! @isUnique
  name: String
  dateOfBirth: DateTime

  posts: [Post!]! @relation(name: "UserPosts")
}

type Post @model {
  id: ID! @isUnique
  title: String!
  content: String

  author: User! @relation(name: "UserPosts")
}
```

* inside `server/graphql-service`, run `graphcool deploy` to deploy your new Graphcool service.

* copy the output's Simple API endpoint, it will be used on ApolloClient instances.

* create a `.env` file into the project root folder, and insert your Simple API endpoint as follows:

```
GRAPHQL_ENDPOINT=your_simple_api_endpoint
```

*you can play with your GraphQL API if you open the browser and go to the page of `your_simple_api_endpoint`*

## running the app

* go to project root folder

* run `yarn run dev` or `npm run dev`
