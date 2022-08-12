# Airtable -> Google Data Studio Connector

This [Google Data Studio Connector](https://developers.google.com/datastudio/connector) uses the Airtable Metadata\* and Base APIs to fetch a base's list of tables and fields (schema) as well as all records and make them available to Google Data Studio for visualization.

\* Note that the Metadata API is currently available to Airtable Enterprise customers. The Connector will work without the Metadata API, but will not be able to infer data types.

---

The software made available from this repository is not supported by Formagrid Inc (Airtable) or part of the Airtable Service. It is made available on an "as is" basis and provided without express or implied warranties of any kind.

---

## Step-by-step guide

To get started, you’ll need:
- A Google Data Studio account
- A target base in an Enterprise workspace
- Your Airtable API key

You'll need to self-host the connector script in your own Google Scripts account. To do this, follow these five steps:

1. Create a [Google Apps Script project](https://developers.google.com/datastudio/connector/build#create_a_new_project_in_apps_script)
2. Paste the code from the `Code.js` and `appsscript.json` files in the `src/` directory of this repository into your new Google Apps Script project
3. [Test your connector](https://developers.google.com/datastudio/connector/use)
4. [Create a deployment of your connector](https://developers.google.com/datastudio/connector/deploy)
5. Optionally, share read access of your connector with anyone that will use the connector. You can use [link sharing](https://support.google.com/docs/answer/2494822#link_sharing) so it doesn't show up in Google Drive)

Now you can retrieve Airtable data from any of your bases—just like you would for any other source in Data Studio. ✨