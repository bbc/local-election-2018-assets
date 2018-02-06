# Vanilla Static Component
> A starting point for a static component which is deployed using [sling scanner](https://github.com/bbc/sling-scanner).

## Getting started
Make sure you're a member of the @bbc org on NPM (https://www.npmjs.com/org/bbc); contact Christopher Ashton to get added.

This repo should be used as a starting point for your static component. You should start by cloning it and adding this repo as a named remote (`vanilla`), this will allow you to pull updates from this repo in the future.

**Replace my-component in the below commands with the name of your component**

```
git clone --origin vanilla https://github.com/bbc/vanilla-static-component.git my-component
cd my-component
git remote add origin https://github.com/bbc/my-component.git
git push -u origin master
```

You now need to open the `package.json` file and edit the `name`, `description` and `slingTeam` values to match that of your component.

It's now time to install the dependencies. You will need a Node version of at least 8. You can check which version you're running using `node -v`. You will also need [docker](https://www.docker.com/) installed.

You will need have access to the [BBC private NPM registry](https://github.com/bbc/npm/wiki).

Next we need to install the node dependencies.

```
npm install
```

If you've an .env file within a repo cloned from this one, you will have to update it with the paths to your sandbox certificate and cloud-ca certificate, as otherwise the following command will likely fail.

```
CERT_PATH=/Users/USERNAME/FILE_PATH/certificate.pem
CA_PATH=/Users/USERNAME/FILE_PATH/cloud-ca.pem
```

To check everything is working start the dev server.

```
docker-compose up --build
```

When the component has finished building you can view the component in your browser by navigating to [http://localhost:3000](http://localhost:3000).

You can make changes to the files in the `src/` directory and they should be automatically built and reloaded in the browser (live reloading).

## Building and automated testing
Building, testing and deploying scripts are all handled through NPM scripts.

Whilst you're developing it's recommended you use the dev server with live-reloading. When using the dev server the generated output is stored in memory, so you won't see changes in the `dist/` directory. You can start the dev server by running the following:

```
make dev
```

Note: If you are developing in an **older browser** (e.g. IE < 10) you will need to use an alternative command that forgoes the live-reloading behaviour:

```
make dev-no-reload
```

The tests are found in the `spec/` directory. You should add new tests for your components there. You can run the tests by executing the following.

```
npm test
```

You can run the tests in watch mode; they will get run automatically each time you save.

```
npm run test:watch
```

To build the output and save it to the `dist/` directory you can run.

```
npm run build
```

You can also build a production ready output, which will be minified and optimised for production use. 

```
npm run build:prod
```

## Deployments
You can deploy your static component to Sling using the [static-component-deployer jenkins job](https://jenkins.news.tools.bbc.co.uk/view/Visual%20Journalism/job/static-component-deployer/). Click build with parameters and enter in the details of your component.

You can also deploy the component from your machine as long as you have [sling setup](https://github.com/bbc/sling-cli#setup) on your machine.

To deploy you have the following commands:

```bash
npm run deploy:test # Deploy to test
npm run deploy:test:overwrite # ^ & overwriting if the version is already found
npm run deploy:live
npm run deploy:live:overwrite
```

## Salieri config
The dev-server uses [salieri](https://github.com/jamesdonoh/salieri) to serve your component in the test page ([http://localhost:3000](http://localhost:3000)).

If you want to add extra components to the test page or change the salieri template, you can find both of these in the `salieri/` directory. If you change these files while the dev-server is running the changes should be reloaded automatically.

## Conventions
The static component enveloper will take files from the `src/` directory and use them to generate an output. The output will be JSON envelope files along with their compiled assets (CSS and JS).

Each .html file in the `src/` directory will generate a new envelope.json file. The name of the .html file will determine the name of the .json file. The contents of the .html file will be placed in the `bodyInline` section of the envelope.

If you have multiple .html files then multiple .json files will be generated, they will all contain the same CSS and JS assets.

With the standard configuration the SASS in the `src/sass` directory will be compiled and minified into a `styles.css` file. This file will be included as a `<link rel="stylesheet" ...>` in the `head` section of the envelope.

The JS from the `src/js` directory will be transpiled using babel, compiled and then minified. As we're using babel you can use ES6 features such as arrow functions, and the output will work fine on older browsers.

Webpack is used to build and bundle your component. We have built a webpack plugin [webpack-static-component-enveloper-plugin](https://github.com/bbc/webpack-static-component-enveloper-plugin) to handle the generation of the envelope files. Check out the [readme](webpack-static-component-enveloper-plugin) of that repo for possible configuration values.

When deploying the static component the tooling will take values from your package.json to determine where your component should be deployed. Your component will be deployed to:

```
include/{slingTeam}/static-components/{name}/{version}/
```

You should update your package.json with your slingTeam, name and version number.

## Pulling updates from this repo.
If in the future you would like to pull updates from the vanilla-static-component repository you should be able to do so by rebasing the commits onto your repo.

```
git fetch
git rebase vanilla/master
```

Once you've fixed any merge conflicts and you're happy that it's all working you can push to the changes to your own repo, you will need to use `--force`.

```
git push --force origin/master
```
