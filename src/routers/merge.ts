import {
  handleRecordedChunkCmd,
  handleTitleCoverCmd,
  handleEndCoverCmd,
  handleQuestionCoverCmd,
} from './../scene/index';
import * as Router from '@koa/router';
import { getPath, mergeChunksCmd, runFfmpegCmd } from './../utils/index';
import { v4 as uuid4 } from 'uuid';

const router = new Router({
  prefix: '/merge',
});

// TEST ROUTING
router.get('/', async (ctx) => {
  const dataFromFE = {
    firstName: 'Ivan',
    lastName: 'Ivanov',
    questions: [
      {
        text: ['Do you want to build', 'your digital resume?'],
      },
      {
        text: ['Digital Fearless+ profile', 'is a solution here!'],
      },
    ],
  };

  const videoChunksFromFE = [
    getPath('./src/media/camera/camera01.mp4'),
    getPath('./src/media/camera/camera02.mp4'),
  ];

  // handle video chunks
  const outputChunkFilePaths = Array.from({
    length: videoChunksFromFE.length,
  }).map(() => getPath(`./temporary/chunk_${uuid4()}.mp4`));

  await Promise.all(
    videoChunksFromFE.map((inputPath, i) =>
      runFfmpegCmd(handleRecordedChunkCmd(inputPath, outputChunkFilePaths[i]))
    )
  );

  // prepare title cover
  const outputTitleCoverPath = getPath(`./temporary/title_${uuid4()}.mp4`);
  await runFfmpegCmd(
    handleTitleCoverCmd(
      outputTitleCoverPath,
      dataFromFE.firstName,
      dataFromFE.lastName
    )
  );

  // prepate end cover
  const outputEndCoverPath = getPath(`./temporary/end_${uuid4()}.mp4`);
  await runFfmpegCmd(handleEndCoverCmd(outputEndCoverPath));

  // prepare question covers
  const outputQuestionCoverPaths = Array.from({
    length: videoChunksFromFE.length,
  }).map(() => getPath(`./temporary/question_${uuid4()}.mp4`));
  await Promise.all(
    outputQuestionCoverPaths.map((outputPath, i) =>
      runFfmpegCmd(
        handleQuestionCoverCmd(dataFromFE.questions[i].text, outputPath)
      )
    )
  );

  //merge all chunsk together
  const outputQuestionAndVideoChunksPathsInOrder = Array.from({
    length: videoChunksFromFE.length,
  }).reduce<string[]>(
    (memo, _, i) => [
      ...memo,
      outputQuestionCoverPaths[i],
      outputChunkFilePaths[i],
    ],
    []
  );
  const outputFinalComposition = getPath(`./public/final_${uuid4()}.mp4`);

  await runFfmpegCmd(
    mergeChunksCmd(
      [
        outputTitleCoverPath,
        ...outputQuestionAndVideoChunksPathsInOrder,
        outputEndCoverPath,
      ],
      outputFinalComposition
    )
  );

  ctx.body = {
    path: outputFinalComposition,
  };
});

export default router;
