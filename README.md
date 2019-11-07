# Deprecated, Archived

This compliments [Force Code Extension](https://github.com/celador/ForceCode/) which has implimented similar functionality making this unneeded.

---

# SF-Resourcer 

VS Code extension for working with Salesforce Static Resources.

## Features

Adds `Work on a Static Resource` command to the command list.

When ran, this scans `/staticresource/` for `.resource` files and builds list to choose which to work on.

When selected, this un-zips to a directory

Now a dev can dev in that folder like they normally would 

When Dev saves, this will zip the folder, replace old one in `/staticresource/`

It will then uses the username and pass/token in the force.json file to upsert the newly zipped `.resource` file 🤯

## Requirements

[VS Code](https://github.com/Microsoft/vscode)

## Extension Settings

N/A

## Known Issues

N/A

## Release Notes

Not much here...

### 0.0.1

Initial release of Salesforce Resourcer

-----------------------------------------------------------------------------------------------------------

## Working with Salesforce Resourcer

**Note:** This looks for a force.json file with the username and password (concatinated with token)

### To Contact, click below then Reach Out

Written with ♥️ by [Jamie Smith](https://jamiesmiths.com)
