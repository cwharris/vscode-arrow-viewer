import * as vscode from 'vscode';
import { ArrowDocumentContentProvider } from './ArrowDocumentContentProvider';

export function activate(context: vscode.ExtensionContext) {

    let subscriptions: vscode.Disposable[] = [];

    context.subscriptions.push(
        new vscode.Disposable(
            () => vscode.Disposable.from(...subscriptions).dispose()
        )
    );

    subscriptions.push(
        vscode.commands.registerCommand('arrowViewer.openInViewer', openInViewer),
        vscode.commands.registerCommand('arrowViewer.openInViewerTest', openInViewerTest),
        vscode.workspace.registerTextDocumentContentProvider(
            'arrowFile',
            new ArrowDocumentContentProvider()
        )
    );
}

function openInViewer (uri: vscode.Uri): void {

    if (!uri) {
        vscode.window.showInformationMessage('no file');
        return;
    }

    let arrowFileUri = uri.with({scheme: 'arrowFile'});

    vscode.commands.executeCommand(
        'vscode.previewHtml',
        arrowFileUri,
        vscode.ViewColumn.Active,
        "3D Mesh Preview"
    );

    vscode.window.showInformationMessage(arrowFileUri.toString());
}

function openInViewerTest() {
    openInViewer(
        vscode.Uri.parse("/home/cwharris/src/vscode-arrow-inspector/src/test/data/cpp/file/datetime.arrow")
    );
}
