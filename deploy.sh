echo "- Uploading to Google Chrome Store"
zip -r extension.zip . -x *.git* -x *.DS_Store* -x *.dpl* -x deploy.sh -x .travis.yml -x LICENSE -x README.md

TOKEN=$(curl "https://accounts.google.com/o/oauth2/token" -d \
    "client_id=$CHROME_API_CLIENT_ID&client_secret=$CHROME_API_CLIENT_SECRET&refresh_token=$CHROME_API_REFRESH_TOKEN&grant_type=refresh_token&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | jq -r '.access_token')

UPLOAD_STATUS=$(curl \
    -H "Authorization: Bearer $TOKEN"  \
    -H "x-goog-api-version: 2" \
    -X PUT \
    -T ./extension.zip \
    https://www.googleapis.com/upload/chromewebstore/v1.1/items/$APP_ID | jq -r ".uploadState")

if [ "$UPLOAD_STATUS" = "FAILURE" ]
then
    exit 1
fi
