'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
// import 'vscode';
function activate(context) {
    // 👍 formatter implemented using API
    vscode.languages.registerDocumentFormattingEditProvider('lgl', {
        provideDocumentFormattingEdits: function (document) {
            // const whitespace
            var edits = [];
            var indentLevel = 0;
            var indentLeftChars = "{";
            var indentRightChars = "}";
            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                var whiteIdx = line.firstNonWhitespaceCharacterIndex;
                var lineText = line.text;
                var numLeft = 0;
                var numRight = 0;
                var onlyRights = true;
                var inString = null;
                var curEdit = null;
                for (var charIdx = 0; charIdx < lineText.length; charIdx++) {
                    var char = lineText[charIdx];
                    if (indentLeftChars.indexOf(char) != -1 && inString == null) {
                        numLeft++;
                        if (onlyRights) {
                            onlyRights = false;
                        }
                    }
                    else if (indentRightChars.indexOf(char) != -1 && inString == null) {
                        numRight++;
                        if (onlyRights) {
                            curEdit = vscode.TextEdit.replace(new vscode.Range(line.range.start, new vscode.Position(i, whiteIdx)), " ".repeat((indentLevel - numRight) * 4));
                        }
                    }
                    if (char == '"' && inString == null) {
                        inString = '"';
                    }
                    else if (char == "'" && inString == null) {
                        inString = "'";
                    }
                    else if (char == inString && lineText[charIdx - 1] != '\\') {
                        inString = null;
                    }
                }
                if (numLeft == 0 && numRight == 0) {
                    curEdit = vscode.TextEdit.replace(new vscode.Range(line.range.start, new vscode.Position(i, whiteIdx)), " ".repeat(indentLevel * 4));
                }
                else if (numLeft - numRight > 0) {
                    curEdit = vscode.TextEdit.replace(new vscode.Range(line.range.start, new vscode.Position(i, whiteIdx)), " ".repeat(indentLevel * 4));
                }
                else if (numLeft - numRight == 0) {
                    // curEdit = vscode.TextEdit.replace(new vscode.Range(line.range.start, new vscode.Position(i, whiteIdx)), " ".repeat((indentLevel - 1) * 4))
                }
                indentLevel += numLeft - numRight;
                if (curEdit) {
                    edits.push(curEdit);
                }
            }
            // Currently disabled.
            return [];
            // return edits;
        }
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map