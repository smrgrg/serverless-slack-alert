'use strict';
const https = require('https');
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
                hostname: 'hooks.slack.com',
                path: this.hooksURL,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': message.length
                }
            };

            const req = https.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`);

                res.on('data', d => {
                    process.stdout.write(d)
                })
            });

            req.on('error', error => {
                console.error(error)
            });

            req.write(message);
            req.end();

        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = SlackAlert;
