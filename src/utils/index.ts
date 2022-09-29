import { FfmpegCommand } from 'fluent-ffmpeg';
import * as ffmpeg from 'fluent-ffmpeg';
import { path as rootPath } from 'app-root-path';
import * as path from 'path';

export const runFfmpegCmd = (command: FfmpegCommand) =>
  new Promise<void>((res) => {
    command
      .on('end', () => {
        res();
      })
      .run();
  });

export const getRootPath = () => rootPath;

export const getPath = (relativePath: string) =>
  path.resolve(getRootPath(), relativePath);

export const mergeChunksCmd = (files: string[], outputFile: string) => {
  const command = files.reduce(
    (command, filePath) => command.input(filePath),
    ffmpeg()
  );

  // here we need to prepare special filter for concationation
  // if we need to concat 3 stream with video, audio this final
  // filter should look like that
  // [0:v] [0:a] [1:v] [1:a] [2:v] [2:a] concat=n=3:v=1:a=1 [v] [a]
  const filterLabels = Array.from({ length: files.length }).reduce(
    (filter, _, index) => `${filter} [${index}:v] [${index}:a]`,
    ''
  );
  const filter = `${filterLabels} concat=n=${files.length}:v=1:a=1 [v] [a]`;

  command
    .complexFilter(filter, ['v', 'a'])
    .output(outputFile)
    .on('progress', (p) => console.log(p));

  return command;
};
