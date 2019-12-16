Serverless Slack Alert
=================================================

Alerts in slack while deploying serverless functions.


Installation
------------

1.Install the `serverless-slack-alert plugin`
```
npm i serverless-slack-alert
```

2.Create a file `config.yml` in your project folder and add a variable `slackHookUrl`.
This url should be the Web hooks url of your slack app. 

``` yaml
slackHookUrl: https://hooks.slack.com/services/XYZ/XYZ/XYZ
```

3.Add plugin in your `serverless.yml` file.
``` yaml
plugins:
    - serverless-slack-alert
```


    
