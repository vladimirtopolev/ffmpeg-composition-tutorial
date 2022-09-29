import { getPath } from './utils/index';
import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as serve from 'koa-static';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

import mergeVideoRouter from './routers/merge';

const app = new Koa();
const PORT = process.env.PORT || 3100;

// create public and temporary folder
fs.mkdirSync(getPath('./public'), { recursive: true });
fs.mkdirSync(getPath('./temporary'), { recursive: true });



app.use(serve('public'));
app.use(cors());
app.use(mergeVideoRouter.routes()).use(mergeVideoRouter.allowedMethods());

app.listen(PORT);

console.log(`Server running on port ${PORT}`);
