# GOKb-Client

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# GOKb Backend
The GOKb Backend consists of the data APIs and a generic view.
It exists a test environment, that can be used for development.
The data APIs are provided below https://gokbt.gbv.de/gokb, the view below https://gokbt.gbv.de/gokb.
The link to the admin view needs an account and gets you to https://gokbt.gbv.de/gokb/home/index

At this time during development you need a hack to make it run. That means you have to manually set
the cookie given by authenticat with: javascript:document.cookie="JSESSIONID=FB15DEA440AF32F60B17AC4E2CA8B1F7"
in the console of the developer tools.

## Wiki
The wiki is provided below https://github.com/openlibraryenvironment/gokb/wiki.

## Source
You can get the source through github with https://github.com/openlibraryenvironment/gokb.
