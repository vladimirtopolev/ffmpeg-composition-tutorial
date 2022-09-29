import * as ffmpeg from 'fluent-ffmpeg';
import { AudioVideoFilter } from 'fluent-ffmpeg';
import { getPath } from '../utils';

export const handleRecordedChunkCmd = (inputPath: string, outputPath: string) =>
  ffmpeg()
    .input(inputPath)
    .input(getPath('./src/media/pics/logo.png'))
    .complexFilter([
      {
        inputs: ['0'],
        outputs: ['cropped'],
        filter: 'crop',
        options: {
          w: 'in_h*9/16',
          h: 'in_h',
          x: '(in_w-ow)/2',
          y: 0,
        },
      },
      {
        inputs: ['cropped', '1'],
        filter: 'overlay',
        options: {
          x: 'W/2-w/2',
          y: 'H-h-30',
        },
      },
    ])
    .output(outputPath)
    .outputFPS(30);

const TARGET_FONT_FILE = getPath('./src/media/fonts/ProximaNova.otf');

export const handleTitleCoverCmd = (
  outputPath: string,
  firstName: string,
  lastName: string
) =>
  ffmpeg()
    .input(getPath('./src/media/covers/start.mp4'))
    .videoFilters([
      {
        filter: 'drawtext',
        options: {
          fontfile: TARGET_FONT_FILE,
          fontcolor: '#ffffff',
          fontsize: 58,
          text: firstName,
          x: '(w-tw)/2',
          y: 'h/2-th-15',
        },
      },
      {
        filter: 'drawtext',
        options: {
          fontfile: TARGET_FONT_FILE,
          fontcolor: '#ffffff',
          fontsize: 58,
          text: lastName,
          x: '(w-tw)/2',
          y: 'h/2+15',
        },
      },
    ])
    .output(outputPath)
    .outputFPS(30);

export const handleQuestionCoverCmd = (lines: string[], outputPath: string) => {
  const margin = 10;

  const filter = lines.reduce(
    (memo, line, index) => [
      ...memo,
      {
        filter: 'drawtext',
        options: {
          fontfile: TARGET_FONT_FILE,
          fontcolor: '#ffffff',
          fontsize: 32,
          text: line,
          x: '(w-tw)/2',
          y: `h/2-(th*${lines.length}+${
            margin * lines.length - 1
          })/2 + (th+${margin})*${index}`,
        },
      },
    ],
    [] as AudioVideoFilter[]
  );
  
  return ffmpeg()
    .input(getPath('./src/media/covers/question.mp4'))
    .videoFilter(filter)
    .output(outputPath)
    .outputFPS(30);
};

export const handleEndCoverCmd = (outputPath: string) =>
  ffmpeg()
    .input(getPath('./src/media/covers/end.mp4'))
    .output(outputPath)
    .outputFPS(30);
