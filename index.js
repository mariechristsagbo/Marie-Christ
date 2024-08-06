const { promises: fs } = require('fs');
const readme = require('./readme');

const msInOneDay = 1000 * 60 * 60 * 24;
const today = new Date();

function generateNewREADME() {
  const readmeRow = readme.split('\n');

  function updateIdentifier(identifier, replaceText) {
    const identifierIndex = findIdentifierIndex(readmeRow, identifier);
    if (identifierIndex === -1) {
      console.log(`Identifier <#${identifier}> not found.`);
      return;
    }
    console.log(`Updating identifier <#${identifier}> with ${replaceText}`);
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

function getDBNWSentence() {
  const nextYear = today.getFullYear() + 1;
  const nextYearDate = new Date(String(nextYear));

  const timeUntilNewYear = nextYearDate.getTime() - today.getTime();
  const dayUntilNewYear = Math.round(timeUntilNewYear / msInOneDay);

  return `**${dayUntilNewYear} day before ${nextYear} ⏱**`;
}

const findIdentifierIndex = (rows, identifier) =>
  rows.findIndex((r) => Boolean(r.match(new RegExp(`<#${identifier}>`, 'i'))));

const updateREADMEFile = async (text) => {
  console.log('Updating README.md file...');
  await fs.writeFile('./README.md', text);
  console.log('README.md file updated.');
};

async function main() {
  try {
    const newREADME = generateNewREADME();
    console.log('Generated new README content:');
    console.log(newREADME);
    await updateREADMEFile(newREADME);
  } catch (error) {
    console.error('Error updating README.md:', error);
  }
}

main();
