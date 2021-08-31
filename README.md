# Airtable -> Google Data Studio Community Connector

This [Google Data Studio Community Connector](https://developers.google.com/datastudio/connector) (GDS) uses the Airtable Metadata\* and Base APIs to fetch a base's list of tables and fields (schema) as well as all records and make them available to Google Data Studio for visualization.

📚 **Looking to learn how to use this Google Data Studio Community Connector with an Airtable base?** [Visit the support article with step-by-step instructions and screenshots](https://support.airtable.com/hc/en-us). The rest of this README is geared toward a technical audience.

---

Learn about how to use a GDS Community Connector [here](Google Apps Script). The URL for this GDS Community Connector, hosted as a Google Apps Script, is:

```
https://datastudio.google.com/datasources/create?connectorId=AKfycbwYflZKMjaBAIYXJ9vjOcIVFVktE23ccsP_luAXAjKraQTVTque5umjBHnFPLvhvCJg
```

- Note that the Metadata API is currently available to Airtable Enterprise customers. Customers on other plans can request Metadata API access [here](https://airtable.com/shrWl6yu8cI8C5Dh3). The Connector will work without the metadata API, but will not be able to infer data types.

---

The software made available from this repository is not supported by Formagrid Inc (Airtable) or part of the Airtable Service. It is made available on an "as is" basis and provided without express or implied warranties of any kind.

---

### For local development and testing:

1. Clone this repository
2. Install _Node_ dependencies (different from the external libraries loaded from `index.html`) by running `npm install`
3. Create a [Google Apps Script](https://script.google.com) and copy the script ID
4. Run npx @google/dscc-gen connector --script_id YOUR_SCRIPT_ID to connect your local environment to your Google Apps Script

### Hosting this Google Data Studio Community Connector

This Community Connector is currently hosted as a Google Apps Script. If you'd like to host this Community Connector yourself, [Google has some recommendations here](https://developers.google.com/datastudio/connector/build).
