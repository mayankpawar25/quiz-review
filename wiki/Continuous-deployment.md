If you want to update the existing Quiz app with latest functionality-

1.  Make sure you have cloned the latest app repository locally.

1.  Open the `actionManifest.json` file in a text editor.

    * Update the placeholder fields (packageID, developer.[]()name,
        developer.websiteUrl, developer.privacyUrl, developer.termsOfUseUrl) in
        the manifest with existing values in your Quiz app.

    * Update the version field in the manifest. Make sure latest version
        number is higher than previous version number.

1.  Run the command below to update your Quiz app with the latest version of
    code. When prompted, log in using your AAD account.

    `npm run update-teams-app`

1.  Your Quiz app on Teams automatically gets updated to the latest version.