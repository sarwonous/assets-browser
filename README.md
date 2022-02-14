# Assets-Browser

this is a simple implementation on google cloud storage asset browser

## Usage

- Create a google auth json key [Google Authentication](https://cloud.google.com/docs/authentication/getting-started)
- Set your `.env` file
- run the following commands
	- docker build . --file Dockerfile --tag assets-browser:latest
	- docker run --env-file .env \
	   --mount type=bind,source=**$(pwd)/<YOUR_GOOGLE_AUTH_JSON>**,target=/app/config/google-config.json -p 3000:3000 assets-browser
	   