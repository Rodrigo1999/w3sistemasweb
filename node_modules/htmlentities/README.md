htmlentities.js lets you deal with "complex" HTML entities (not just the usual '<' '>' '"' and '&' special characters) in an elegant, JS-oriented way, on the server *and* in the browser, without dependencies.

[Demo](http://alexduloz.github.io/htmlentities/demo.html)

# Install

## On the server

`$ npm install htmlentities`

`var htmlentities = require('htmlentities');`

## In the browser

`<script src="htmlentities.js"></script>`

# Methods

## `.encode(string[, encoding])`

Returns the encoded version of `string`. If omitted, `encoding` defaults to `UTF-8`.


## `.decode(string[, encoding])`

Returns the decoded version of `string`. If omitted, `encoding` defaults to `UTF-8`.

# Encodings

The following encodings are supported:

* __UTF-8__ (aliased __utf8__)


# Notes

I wrote this plugin because I needed to compare two strings: one was encoded, one wasn't. I didn't find a library that would easily let me do it. There are nice node modules, there are client-side libraries, and there are jQuery hacks. But if you want a script that is straightforward and runs both in the browser and on the server, you will probably find htmlentities.js useful.
