'use strict';
const request = require("request");
const yaml = require('js-yaml');
const fs   = require('fs');

class SlackAlert {
    constructor(sls, options) {
        this.sls = sls;
        this.config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
        this.hooksURL = this.config.slackHookUrl;
        this.options = options;
        this.commands = {
            deploy: {
                lifecycleEvents: ['resources', 'functions'],
            },
        };

        this.hooks = {
            // 'before:deploy:resources': this.beforeDeployResources,
            // 'deploy:resources': this.deployResources,
            'after:deploy:functions': this.afterDeployFunctions.bind(this),
        };
    }

    beforeDeployResources() {
        console.log('Before Deploy Resources ******');
    }

    deployResources() {
        console.log('Deploy Resources ******');
    }

    afterDeployFunctions() {
        console.log('Running Slack Alert: After Deploy Functions');

        try {

            const message = function(name, options){
                let msg;
                if(options){
                    msg = `Service "${name}" deployed. Params passed: "${JSON.stringify(options)}".`;
                }else{
                    msg = `Service "${name}" deployed.`;
                }
                return JSON.stringify({text:msg});
            }(this.sls.service.service, this.options);

            const options = {
                url: this.hooksURL,
                body: message
            };

            request.post(options, function (error, response, body) {
                if (error) console.error(error);
            });

        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = SlackAlert;
