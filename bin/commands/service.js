const program = require('commander');
const chalk = require('chalk');
const path = require('path');
const helper = require('think-helper');
const utils = require('../../lib/utils');
const logger = require('../../lib/logger');
const Run = require('../../lib/run');
const argv = require('minimist')(process.argv.slice(2));

/**
 * Usage.
 */

program
  .usage('<service-name> [module-name]');

/**
 * Help.
 */

program.on('--help', function() {
  console.log();
  console.log('  Examples:');
  console.log();
  console.log(chalk.gray('    # create a service with the name ' + chalk.gray.underline.bold('user')));
  console.log('    $ thinkjs service user');
  console.log();
  console.log(chalk.gray('    # create a service with the name ' + chalk.gray.underline.bold('user') + ' in multi-module mode'));
  console.log('    $ thinkjs service user home');
  console.log();
});

program.parse(process.argv);

if (program.args.length < 1) return program.help();

/**
 * Padding.
 */

console.log();
process.on('exit', function() {
  console.log();
});

/**
 * Start.
 */

const appPath = path.join(path.resolve('./'));
if (!utils.isThinkApp(appPath)) {
  logger.error(
    'Please execute the command in the ' +
    chalk.yellow.underline.bold('thinkjs project') +
    ' root directory'
  );
}

const thinkjsInfo = require(path.join(appPath, 'package.json')).thinkjs;
const actionName = program.args[0];

const context = Object.assign(thinkjsInfo.metadata, argv, {
  action: utils.getActionName(actionName),
  moduleName: program.args[1] || thinkjsInfo.metadata.defaultModule,
  actionPrefix: utils.getPrefix(actionName),
  ROOT_PATH: appPath,
  APP_NAME: thinkjsInfo.projectName
});

const run = new Run({
  template: thinkjsInfo.template,
  targetPath: appPath,
  options: { name: thinkjsInfo.metadata.name, command: 'service', maps: 'service', context },
  done(err, files) {
    if (err) return logger.error(err);
    Object
      .keys(files)
      .forEach(file => {
        logger.success('Create: %s', path.normalize(file));
      });
  }
});

run.start();
