const program = require('commander');
const chalk = require('chalk');
const path = require('path');
const helper = require('think-helper');
const utils = require('../../lib/utils');
const logger = require('../../lib/logger');
const argv = require('minimist')(process.argv.slice(2));
const Run = require('../../lib/run');

/**
 * Usage.
 */

program
  .usage('<controller-name> [module-name]')
  .option('-r, --rest', 'create rest controller');

/**
 * Help.
 */

program.on('--help', function() {
  console.log();
  console.log('  Examples:');
  console.log();
  console.log(chalk.gray('    # create a controller with the name ' + chalk.gray.underline.bold('user')));
  console.log('    $ thinkjs controller user');
  console.log();
  console.log(chalk.gray('    # create rest controller'));
  console.log('    $ thinkjs controller user -r');
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
const moduleName = program.args[1] || thinkjsInfo.metadata.defaultModule;

const maps = program.rest
  ? 'controller.rest'
  : 'controller.default';

const context = Object.assign(thinkjsInfo.metadata, argv, {
  action: utils.getActionName(actionName),
  moduleName,
  actionPrefix: utils.getPrefix(actionName),
  ROOT_PATH: appPath,
  APP_NAME: thinkjsInfo.projectName
});

const run = new Run({
  template: thinkjsInfo.template,
  targetPath: appPath,
  options: { name: thinkjsInfo.metadata.name, command: 'controller', maps, context },
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
