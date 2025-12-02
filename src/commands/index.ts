import { Command } from './types';
import { helpCommand } from './help';
import { clearCommand } from './clear';
import { quackCommand } from './quack';
import { whoamiCommand } from './whoami';
import { exitCommand } from './exit';
import { bgcolorCommand } from './bgcolor';
import { weatherCommand } from './weather';
import { jokeCommand } from './joke';
import { lsCommand } from './ls';
import { catCommand } from './cat';
import { addEmployeeCommand } from './add-employee';
import { holidayCommand } from './holiday';
import { fontCommand } from './font';

export const commands: { [key: string]: Command } = {
  help: helpCommand,
  clear: clearCommand,
  quack: quackCommand,
  whoami: whoamiCommand,
  exit: exitCommand,
  bgcolor: bgcolorCommand,
  weather: weatherCommand,
  joke: jokeCommand,
  ls: lsCommand,
  cat: catCommand,
  'add-employee': addEmployeeCommand,
  holiday: holidayCommand,
  font: fontCommand,
};