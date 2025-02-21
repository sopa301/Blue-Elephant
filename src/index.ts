import { Scenes, session, Telegraf } from 'telegraf';
import { BotContext } from './BotContext';

import {
    about,
    manageProjectScene,
    deleteProjectScene,
    addProjectScene,
    editProjectScene,
    editProjectNameScene,
    editProjectDescriptionScene,
    viewMainMenuScene,
    viewProjectScene,
    generateExistingProjectsScene,
    generateGroupingsScene,
    resetInteractionsScene,
} from './commands';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import { connectToDatabase } from './db/functions';
import {} from 'dotenv/config';
import { addPeopleScene } from './commands/editProject/addPeopleScene';
import { deletePeopleScene } from './commands/editProject/deletePeopleScene';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf<BotContext>(BOT_TOKEN);

// Set command suggestions
bot.telegram.setMyCommands([
    {
        command: 'about',
        description: 'About command',
    },
    {
        command: 'start',
        description: 'starts the bot',
    },
]);

const stage = new Scenes.Stage<BotContext>([
    addProjectScene,
    viewMainMenuScene,
    manageProjectScene,
    generateExistingProjectsScene,
    deleteProjectScene,
    viewProjectScene,
    editProjectScene,
    editProjectNameScene,
    editProjectDescriptionScene,
    addPeopleScene,
    deletePeopleScene,
    generateGroupingsScene,
    resetInteractionsScene,
]);

bot.use(session());
bot.use(stage.middleware());

bot.command('about', about());

bot.command('start', (ctx) => ctx.scene.enter('mainMenu'));

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
    await connectToDatabase();
    await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
connectToDatabase().catch(console.dir);
