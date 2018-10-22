// jshint asi: true, esversion: 6, laxcomma: true
'use strict()'

const vscode = require('vscode')
    , fs = require('fs')
    , jsforce = require('jsforce')
    , recent = {instanceUrl:'', accessToken:''}
    , getConn = () => new jsforce.Connection({
        instanceUrl: recent.instanceUrl,
        accessToken: recent.accessToken
    })
    , path = vscode.workspace.workspaceFolders[0].uri.fsPath
    , config = JSON.parse(fs.readFileSync(`${path}\\force.json`, 'utf8'))
    , url = config.url
    , user = config.username
    , pass = config.password
    , conn = new jsforce.Connection({
        instanceUrl: url,
        loginUrl: url
    })
;

module.exports = {

    connect: () => new Promise((res, rej) => 
        conn.login(user, pass, (err, userInfo) => {
            recent.instanceUrl = conn.instanceUrl
            recent.accessToken = conn.accessToken
            err ? rej(err) : res('logged in')
        })
    ),
    deploy: (fullName, path) => new Promise((resolve, reject) => {
        //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_staticresource.htm?search_text=static%20resource

        const conn = getConn()
        const rsc = `${path}\\src\\staticresources\\`
        const name = fullName.substring(0, fullName.lastIndexOf('.'))
        
        const soql = `SELECT Id, Name, Description FROM StaticResource WHERE Name = '${name}'`

        conn.query(soql, {}, (e, result) => {
            e ? reject(e) : null
            console.log(result[0])
            const resrc = result[0] 
                ? {
                    Id: result[0].Id
                  , description: result[0].Description
                  , fullName: name
                  , cacheControl: "Public"
                  , contentType : "application/x-zip-compressed"
                }
                : {
                    fullName: name
                  , cacheControl: "Public"
                  , contentType : "application/x-zip-compressed"
                  , description: "Deployed with SF-Resourcer"
                }

            
            const read = new Promise((res, rej) =>
                fs.readFile(rsc+fullName, (err, data) => err ? rej(err) : res(data)))

            read.then(content => {

                resrc.content = content.toString('base64')

                conn.metadata.upsert('StaticResource', resrc, (error, results) => 
                    error ? reject(`🤔 ${error}`) : resolve(`🤗 Deployed Static Resource ${name} ☄️`))
            })
            read.catch(e => reject(e))
        })
    })
}