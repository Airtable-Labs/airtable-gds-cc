var cc = DataStudioApp.createCommunityConnector();

function sendUserError(message) {
  cc.newUserError()
    .setText(message)
    .throwException();
}

function getAuthType() {
  var response = { type: "NONE" };
  return response;
}

function isAuthValid() {
  return true;
}

function setCredentials() {
  return {
    errorCode: "NONE",
  };
}

function getConfig() {
  var connectorConfig = cc.getConfig();
  connectorConfig.setDateRangeRequired(false);

  connectorConfig
    .newTextInput()
    .setId("base_id")
    .setName("Enter a base id");

  connectorConfig
    .newTextInput()
    .setId("table_name")
    .setName("Enter the name of a table");

  connectorConfig
    .newTextInput()
    .setId("view_name")
    .setName("Enter the name of a view");

  connectorConfig
    .newTextInput()
    .setId("airtable_api_key")
    .setName("Enter your airtable API key");

    return connectorConfig.build();
}

function fetchData(url, key) {
  var response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: "Bearer " + key,
    },
  });

  var content = response.getContentText();
  if (!content) {
    sendUserError('"' + url + '" returned no content.');
  }
  return content;
}

function getFieldType(fieldType) {
  var types = cc.FieldType;

  var FIELD_TYPES_DICTIONARY = {
    autoNumber: types.NUMBER,
    barcode: types.TEXT,
    button: types.TEXT,
    checkbox: types.BOOLEAN,
    count: types.NUMBER,
    createdBy: types.TEXT,
    createdTime: types.TEXT,
    currency: types.CURRENCY_USD,
    date: types.TEXT,
    dateTime: types.TEXT,
    duration: types.DURATION, // todo: figure out AT duration, gds is in seconds
    email: types.TEXT,
    externalSyncSource: types.TEXT,
    formula: types.TEXT,
    lastModifiedBy: types.TEXT,
    lastModifiedTime: types.TEXT,
    multilineText: types.TEXT,
    multipleAttachments: types.TEXT,
    multipleCollaborators: types.TEXT,
    multipleLookupValues: types.TEXT,
    multipleRecordLinks: types.TEXT,
    multipleSelects: types.TEXT,
    number: types.NUMBER,
    percent: types.PERCENT,
    phoneNumber: types.TEXT,
    rating: types.NUMBER,
    richText: types.TEXT,
    rollup: types.TEXT,
    singleCollaborator: types.TEXT,
    singleLineText: types.TEXT,
    singleSelect: types.TEXT,
    url: types.URL,
  };

  var gdsFieldType = FIELD_TYPES_DICTIONARY[fieldType];
  return gdsFieldType;
}

function getRecords(request) {
  var tableName = request.configParams.table_name;
  var viewName = request.configParams.view_name;
  var baseId = request.configParams.base_id;
  var apiKey = request.configParams.airtable_api_key;
  return airtable_list_all_records(baseId, apiKey, tableName, viewName);
}

function airtable_list_all_records(baseId, apiKey, tableName, viewName, offset){
  offset = offset || "";
  var content = fetchData(
    "https://api.airtable.com/v0/" +
      baseId +
      "/" +
      encodeURI(tableName) +
      "?view=" +
      encodeURI(viewName) +
      "&offset=" + offset
    ,
    apiKey
  );

  var data = JSON.parse(content);
  var records = data.records;
  var newOffset = data.offset;

  if(newOffset === undefined)
    return records || [];
  
  return records.concat(airtable_list_all_records(baseId, apiKey, tableName, viewName, newOffset));
}

function getFields(request) {
  var ccFields = cc.getFields();
  var tableName = request.configParams.table_name;
  var baseId = request.configParams.base_id;
  var apiKey = request.configParams.airtable_api_key;
  var fields = [];

  var content;
  content = fetchData(
    "https://api.airtable.com/v0/meta/bases/" + baseId + "/tables",
    apiKey
  );

  var tables = JSON.parse(content).tables;
  // .find isn't working for some reason (google script error?)
  var matches = tables.filter(function(t) {
    return t.name == tableName;
  });

  fields = matches.length ? matches[0].fields : [];

  if (fields.length) {
    fields.forEach(function(f) {
      var fieldType = getFieldType(f.type);
      if(!fieldType)
        return;
      var field = ccFields.newDimension();

      field.setType(fieldType);
      field.setId(f.id);
      field.setName(f.name);
    });
  }

  return ccFields;
}

function getSchema(request) {
  var fields = getFields(request);
  var schema = fields.build();
  return { schema: schema };
}

function getData(request) {
  var fields = getFields(request);
  var records = getRecords(request);
  var requestedFieldIds = request.fields.map(function(field) {
    return field.name;
  });

  var requestedFields = fields.forIds(requestedFieldIds);

  var rows = [];
  var fieldIdToFieldNameMap = fields.asArray().reduce(function(map, f){
    map[f.getId()] = f.getName();
    return map;
  }, {});

  rows = records.map(function(record){
    var row = requestedFieldIds.map(function(id){
      var result = record.fields[fieldIdToFieldNameMap[id]];
      return result + ""; 
      //Force return string, as formula type is defined with field type string, but airtable may return number. Return number would cause error if field type is set to text.
    });
    return { values: row };
  });


  var result = {
    schema: requestedFields.build(),
    rows: rows,
  };

  //throw JSON.stringify(result);
  return result;
}

function isAdminUser() {
  return true;
}
