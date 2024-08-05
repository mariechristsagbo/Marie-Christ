const { promises: fs } = require('fs');
const { exec } = require('child_process');
const readme = require('./readme');

const msInOneDay = 1000 * 60 * 60 * 24;
const oneSecond = 1000; 

const today = new Date();

function generateNewREADME() {
  const readmeRow = readme.split('\n');

  function updateIdentifier(identifier, replaceText) {
    const identifierIndex = findIdentifierIndex(readmeRow, identifier);
    if (!readmeRow[identifierIndex]) return;
    readmeRow[identifierIndex] = readmeRow[identifierIndex].replace(
      `<#${identifier}>`,
      replaceText
    );
  }

  const identifierToUpdate = {
    day_before_new_years: getDBNWSentence(),
    today_date: getTodayDate(),
    gabot_signing: getGabotSigning(),
  };

  Object.entries(identifierToUpdate).forEach(([key, value]) => {
    updateIdentifier(key, value);
  });

  return readmeRow.join('\n');
}

const moodByDay = {
  1: 'hate',
  2: 'wickedness',
  3: 'pleasure',
  4: 'wickedness',
  5: 'cruelty',
  6: 'horror',
  7: 'love',
};

function getGabotSigning() {
  const mood = moodByDay[today.getDay() + 1];
  return `🤖 This README.md is updated with ${mood}, by Gabot ❤️`;
}

function getTodayDate() {
  return today.toDateString();
}

function getMySelf() {
  return today.getDate() % 2 === 0
    ? Math.floor(Math.random() * 2)
      ? 'penguin 🐧'
      : 'bear 🐻'
    : 'penguin bear 🐧🐻';
}

function getDBNWSentence() {
  const nextYear = today.getFullYear() + 1;
  const nextYearDate = new Date(String(nextYear));

  const timeUntilNewYear = nextYearDate.getTime() - today.getTime();
  const dayUntilNewYear = Math.round(timeUntilNewYear / msInOneDay);

  return `**${dayUntilNewYear} day before ${nextYear} ⏱**`;
}

const findIdentifierIndex = (rows, identifier) =>
  rows.findIndex((r) => Boolean(r.match(new RegExp(`<#${identifier}>`, 'i'))));

const updateREADMEFile = (text) => fs.writeFile('./README.md', text);

function gitCommit() {
  exec('git add . && git commit -m "Automated update to README"', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

function main() {
  setInterval(() => {
    const newREADME = generateNewREADME();
    console.log(newREADME);
    updateREADMEFile(newREADME)
      .then(() => gitCommit())
      .catch(console.error);
  }, oneSecond);
}

main();
