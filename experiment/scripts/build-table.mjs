import klawSync from 'klaw-sync';
import _ from 'lodash';
import fs from 'mz/fs';
import numeral from 'numeral';
import path from 'path';
import Table from 'table';
import write from 'write';

const RESULTS_FOLDER = path.resolve(process.cwd(), './results');
const TABLES_FOLDER = path.resolve(process.cwd(), './tables');

const SORT_BY = ['sum duration'];

const resultFiles = klawSync(RESULTS_FOLDER);

let resultTable = [];

for (let file of resultFiles) {
  const filePath = file.path;
  const result = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const id = path.basename(filePath).replace(/\.[^/.]+$/, '');

  const row = {
    id,
    memory: numeral(result.options.memory).value(),
    loops: numeral(result.options.loops).value(),
    async: result.options.runAsync,
    median: numeral(result.analysis.median).format('0.0000'),
    mean: numeral(result.analysis.mean).format('0.0000'),
    stdDev: numeral(result.analysis.stdDev).format('0.0000'),
    'sum duration': parseFloat(numeral(result.analysis.sum).format('0.0000')),
    'cost in $': numeral(result.analysis.cost).format('0.00000000'),
  };

  resultTable.push(row);
}

const sortedTable = _.sortBy(resultTable, SORT_BY);

const finalTable = [Object.keys(sortedTable[0])];

for (let row of sortedTable) {
  let content = [];
  for (let key in row) {
    content.push(row[key]);
  }
  finalTable.push(content);
}

const txtTableConfig = {
  columns: {
    0: { alignment: 'left' },
    2: { alignment: 'right' },
    3: { alignment: 'right' },
    4: { alignment: 'right' },
    5: { alignment: 'right' },
    6: { alignment: 'right' },
    7: { alignment: 'right' },
    8: { alignment: 'right' },
    9: { alignment: 'right' },
  },
};

const txtTable = Table.table(finalTable, txtTableConfig);
const csvTable = finalTable.map(row => row.join()).join('\n');
console.log(txtTable);

write.sync(path.resolve(TABLES_FOLDER, 'table.txt'), txtTable);
write.sync(path.resolve(TABLES_FOLDER, 'table.csv'), csvTable);
