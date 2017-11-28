const path = require('path');
const chalk = require('chalk');
const Sling = require('@bbc/sling');
const deployPaths = require('./deploy-paths');

const overrides = require('./sling-overrides.json');

class StaticComponentDeployment {
    constructor(options) {
        this.options = options;
        this.deploy();
    }

    async deploy() {
        const sling = await Sling.initFromSlingConfig({
            overrides,
            env: this.options.slingEnv
        });
        try {
            await this.checkVersionDoesntAlreadyExist(sling);
            await this.deployToSling(sling);
            console.info(chalk.green.bold(`\n\nSuccessfully deployed to Sling!\n${deployPaths.getSlingPublicPath()}\n`));
        }
        catch (error) {
            console.error(chalk.red.bold(`\n\n${error}\n`));
            process.exit(1);
        }

    }

    doesOverwriteFlagExist() {
        return process.argv.some((flag) => {
            const overwriteFlags = ['-o', '--overwrite'];
            return overwriteFlags.includes(flag);
        });
    }

    async checkVersionDoesntAlreadyExist(sling) {
        // Skip if the overwrie flag has been passed
        if (this.doesOverwriteFlagExist()) {
            return ;
        }

        let versionAlreadyExists = false;
        try {
            const versionFiles = await sling.list({
                path: this.options.slingPath,
                recursive: false
            });

            if (versionFiles.length > 0) {
                versionAlreadyExists = true;
            }
        }
        catch(error) {
            if (!error.includes('does not exist')) {
                throw new Error(error);
            }
        }

        if (versionAlreadyExists) {
            throw `This version already exists on ${this.options.slingEnv}, if you would like to overwrite it pass the --overwrite (-o) flag.`;
        }
        return ;
    }

    async deployToSling(sling) {
        return await sling.push({
            local: this.options.distFiles,
            destination: this.options.slingPath,
            recursive: true
        });
    }

}

new StaticComponentDeployment({
    distFiles: path.join(__dirname, '../dist/'),
    slingEnv: process.env.SLING_ENV,
    slingPath: deployPaths.getSlingPath(),
});
