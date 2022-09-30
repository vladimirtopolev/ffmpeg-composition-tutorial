# Requirments
- NodeJS v.16.15.0
- FFmpeg v.4.4.1

# Run server
```
yarn install
yarn dev
```
Server will be spun up in port 3100
To initiate video processing hit this URL:
```
GET http://localhost:3100/merge
```
If everythin is good it respondes with the following JSON object:
```
{
"path": "/Users/xxx/VSCode/ffmpeg-nodejs/public/final_9c00ab7c-425c-425a-a074-3109155b0054.mp4"
}
```
Copy the last section of path, in this case it's `final_9c00ab7c-425c-425a-a074-3109155b0054.mp4`
and hit this command:
```
GET http://localhost:3100/final_9c00ab7c-425c-425a-a074-3109155b0054.mp4
```
Browser should stream processed video.