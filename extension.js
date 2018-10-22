// jshint asi: true, esversion: 6, laxcomma: true
const vscode = require('vscode')
const fs = require('fs')
const Zip = require('adm-zip');
const SalesForce = require('./SalesForce');

function activate(context) {
    
    const disposable = vscode.commands.registerCommand('extension.staticResrc', function () {
        
        const path = `${vscode.workspace.workspaceFolders[0].uri.fsPath}`
        const rsc = `${path}\\src\\staticresources\\`
        
        const getFiles = dir => new Promise(resolve => fs.readdir(dir, (err, x) => 
            resolve(x.filter(x => x.substring(x.lastIndexOf('.'), x.length) == '.resource'))))
        
        getFiles(rsc).then(items => vscode.window.showQuickPick(items)
        .then(file => {
            
            const zip = new Zip(rsc+file)
            const newDir = `${path}\\sf-rsc\\${file}`
            
            zip.extractAllTo(`${newDir}`, true)

            vscode.window.showInformationMessage(`Work on extracted resource in ${newDir}`)
            
            const watcher = vscode.workspace.createFileSystemWatcher(`${newDir}/*.*`)

            watcher.onDidChange(x => {
                
                console.info('CHANGED FILE IN DIRECTORY => ')
                
                const zip = new Zip()
                zip.addLocalFolder(newDir)
                
                zip.writeZip(rsc+file)

                SalesForce.connect()
                .then(x => SalesForce.deploy(file, path))
                .then(x => vscode.window.showInformationMessage(x))
                .catch(x => vscode.window.showInformationMessage(x))
            })
        }))
    })

    context.subscriptions.push(disposable);
}

exports.activate = activate