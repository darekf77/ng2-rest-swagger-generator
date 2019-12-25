import * as fs from 'fs';
import chalk from 'chalk';
import * as _ from 'lodash';

import { run } from './generator';


export function start() {


  function isLink(link: string) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    return regex.test(link);
  }

  const pathes = [];
  const links = []
  let { v = false, json, base, s = false }: { v: boolean, s: boolean, json: string[], base: string; } = require('minimist')(process.argv);



  if (v) {
    var pack = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));
    console.log('version: ' + pack['version']);
    process.exit(0);
  }


  if (!json) {
    console.log(chalk.red(`Please specify ${chalk.bold('--json')} parameter`))
    process.exit(1)
  }

  if (_.isString(json)) {
    json = [json]
  }

  json.forEach(f => {

    if (fs.existsSync(f)) {
      if (fs.lstatSync(f).isDirectory()) {
        console.log(chalk.red(`Parametr ${chalk.bold('--json')} with value "${f}" is direcory, not json.`))
        process.exit(1)
      }

      pathes.push(f);
    } else if (isLink(f)) {
      links.push(f);
    } else {
      console.log(chalk.red(`Parametr ${chalk.bold('--base')} with value "${f}" is not a link or path`))
      process.exit(1)
    }

  })


  // console.log('enableHttps', enableHttps)
  run(pathes, links, s, base)
}