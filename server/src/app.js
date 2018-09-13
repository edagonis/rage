import express from 'express';

import path from 'path';
import React from 'react';

// react ssr
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

import Layout from "../../components/Layout";

import fetch from 'node-fetch';

// Apollo
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http'

const app = express();

// express app - server side rendering related
app.use(express.static(path.resolve( __dirname, "../../client/public")));

app.get('/*', (req, res) => {
    const client = new ApolloClient({
        ssrMode: true,
        link: new HttpLink({
            fetch,
            uri: process.env.GRAPHQL_ENDPOINT
        }),
        headers: {
            cookie: req.header('Cookie'),
        },
        cache: new InMemoryCache(),
    });

    const context = {};
    const App = (
        <ApolloProvider client={client}>
            <StaticRouter context={context} location={req.url}>
                <Layout />
            </StaticRouter>
        </ApolloProvider>
    );

    getDataFromTree(App).then(() => {
        const content = renderToString(App);
        const initialState = client.extract();
        const html = <Html content={content} state={initialState} />;

        res.status(200);
        res.send(`<!DOCTYPE html>\n${renderToStaticMarkup(html)}`);
        res.end();
    });
});

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('app is running! go to http://localhost:' + port)
})

const Html = ({ content, state }) => {
    return (
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Rage</title>
                <link rel="stylesheet" type="text/css" href="/styles.css" />
            </head>

            <body>
                <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
                <script dangerouslySetInnerHTML={{
                    __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
                }} />

                <script type="text/javascript" src="./bundle.js"></script>
            </body>
        </html>
    );
}