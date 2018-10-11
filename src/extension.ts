import * as vscode from 'vscode';
import { ArrowDocumentContentProvider } from './ArrowDocumentContentProvider';

export function activate(context: vscode.ExtensionContext) {

    let subscriptions: vscode.Disposable[] = [];

    context.subscriptions.push(
        new vscode.Disposable(
            () => vscode.Disposable.from(...subscriptions).dispose()
        )
    );

    let provider = new ArrowDocumentContentProvider();

    subscriptions.push(
        vscode.commands.registerCommand('arrowViewer.openInViewerFromUri', openInViewerFromUri),
        vscode.commands.registerCommand('arrowViewer.openInViewerFromActiveTextEditor', openInViewerFromActiveTextEditor),
        vscode.workspace.registerTextDocumentContentProvider(
            'arrowFile',
            provider
        ),

    );
}

function openInViewerFromActiveTextEditor(): void {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showInformationMessage('Cannot preview arrow table because there is no active text editor.');
        return;
    }

    openInViewerFromUri(editor.document.uri);
}

const filePathDilimiterRegex = new RegExp('[\\/]');

function openInViewerFromUri (uri: vscode.Uri): void {

    if (!uri) {
        vscode.window.showInformationMessage('Cannot preview arrow table because there is no file uri.');
        return;
    }

    const filename = uri.path.split(filePathDilimiterRegex).pop();

    vscode.commands.executeCommand(
        'vscode.previewHtml',
        uri.with({ scheme: 'arrowFile' }),
        vscode.ViewColumn.Active,
        `${filename} - Arrow Viewer`
    );
}
