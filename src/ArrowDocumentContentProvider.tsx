import * as vscode from 'vscode';
import * as React from 'react';
import * as ReactDomServer from 'react-dom/server';

import { readFileSync } from 'fs';
import { Table } from 'apache-arrow';

export class ArrowDocumentContentProvider implements vscode.TextDocumentContentProvider {
        
    private _onDidChange: vscode.EventEmitter<vscode.Uri>;

    constructor() {
        this._onDidChange = new vscode.EventEmitter<vscode.Uri>();
    }

    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        const arrow = readFileSync(uri.fsPath);
        const table = Table.from([arrow]);

        return ReactDomServer.renderToStaticMarkup(
            <html>
                <body>
                    <table>
                        <tr>
                        {table.schema.fields.map(field =>
                            <th>{field.name}</th>
                        )}
                        </tr>
                        {[...table].map(row =>
                        <tr>
                        {[...row].map(cell =>
                            <td>{"" + cell}</td>
                        )}
                        </tr>
                        )}
                    </table>
                </body>
            </html>
        );
    }
}
