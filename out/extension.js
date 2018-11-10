'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
// import 'vscode';
function activate(context) {
    // 👎 formatter implemented as separate command
    vscode.commands.registerCommand('extension.format-foo', function () {
        var activeTextEditor = vscode.window.activeTextEditor;
        if (activeTextEditor && activeTextEditor.document.languageId === 'foo-lang') {
            var document = activeTextEditor.document;
            var firstLine = document.lineAt(0);
            if (firstLine.text !== '42') {
                var edit = new vscode.WorkspaceEdit();
                edit.insert(document.uri, firstLine.range.start, '42\n');
                return vscode.workspace.applyEdit(edit);
            }
        }
    });
    // 👍 formatter implemented using API
    vscode.languages.registerDocumentFormattingEditProvider('foo-lang', {
        provideDocumentFormattingEdits: function (document) {
            var firstLine = document.lineAt(0);
            if (firstLine.text !== '42') {
                return [vscode.TextEdit.insert(firstLine.range.start, '42\n')];
            }
        }
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map