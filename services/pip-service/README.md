> This repository is part of the [Pelias](https://github.com/pelias/pelias) project. Pelias is an open-source, open-data geocoder built by [Mapzen](https://www.mapzen.com/) that also powers [Mapzen Search](https://mapzen.com/projects/search). Our official user documentation is [here](https://mapzen.com/documentation/search/).

# Pelias Point-in-Polygon Service

[![Greenkeeper badge](https://badges.greenkeeper.io/pelias/pip-service.svg)](https://greenkeeper.io/)

![Travis CI Status](https://travis-ci.org/pelias/pip-service.svg)
[![Gitter Chat](https://badges.gitter.im/pelias/pelias.svg)](https://gitter.im/pelias/pelias?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Overview

This service provides Who's on First-based point-in-polygon lookup functionality.  

## Installation

```bash
$ git clone git@github.com:pelias/pip-service.git
$ cd pip-service
$ npm install
```

[![NPM](https://nodei.co/npm/pelias-pip-service.png?downloads=true&stars=true)](https://nodei.co/npm/pelias-pip-service)

## NPM Module

The `pelias-pip-service` npm module can be found here:

[https://npmjs.org/package/pelias-pip-service](https://npmjs.org/package/pelias-pip-service)

#### Usage

To start the PiP service, type: `npm start`.  By default, the service starts on port 3102. It will look for Who's on First data in the place configured in `pelias.json`.

Requests are made to the endpoint in the format:  `http://localhost:3102/<lon>/<lat>`.

For example: `http://localhost:3102/-106.937/34.060`

#### Downloading data

Because [pelias/whosonfirst](https://github.com/pelias/whosonfirst) is a dependency of this package, its downloader can be used:

`npm run download`

This will download Who's on First data using the same [configuration options](https://github.com/pelias/whosonfirst#downloading-the-data) from `pelias.json` as the whosonfirst downloader.
That means it will automatically put the data in the place the service will expect to load it from.

##### Privacy Concerns

The service supports the `DNT`[https://en.wikipedia.org/wiki/Do_Not_Track] header by looking for one of the following headers:

- `DNT`
- `dnt`
- `do_not_track`

When any of these headers are supplied in the request (with any value), the request log will output `/[removed]/[removed]` instead of the longitude/latitude values.  

#### Configuration

The only available configuration option is the port on which the service runs.  To run on a different port, start with:

`PORT=3103 npm start`
