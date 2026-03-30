"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsViewProvider = void 0;
const vscode = require("vscode");
class SettingsViewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        const updateWebview = () => {
            webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        };
        updateWebview();
        // 当配置在外部发生变化时，刷新 Webview
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('antigravity-auto-accept.countdownDuration')) {
                updateWebview();
            }
        });
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'updateCountdown': {
                    const newValue = parseInt(data.value, 10);
                    if (!isNaN(newValue)) {
                        vscode.workspace.getConfiguration('antigravity-auto-accept').update('countdownDuration', newValue, vscode.ConfigurationTarget.Global);
                        const isZh = vscode.env.language.startsWith('zh');
                        vscode.window.showInformationMessage(isZh ? `自动接受倒计时已更新为 ${newValue} 秒` : `Auto-Accept Countdown updated to ${newValue}s`);
                    }
                    break;
                }
            }
        });
    }
    _getHtmlForWebview(webview) {
        const config = vscode.workspace.getConfiguration('antigravity-auto-accept');
        const currentDuration = config.get('countdownDuration', 12);
        const isZh = vscode.env.language.startsWith('zh');
        const titleText = isZh ? "Antigravity 设置" : "Antigravity Settings";
        const headerText = isZh ? "自动接受倒计时" : "Auto-Accept Countdown";
        const descriptionText = isZh
            ? "自动确认前的空闲等待时间。"
            : "Idle time before auto-accept.";
        const saveBtnText = isZh ? "保存设置" : "Save Settings";
        const unitText = isZh ? "秒" : "s";
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${titleText}</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        padding: 10px;
                        color: var(--vscode-foreground);
                        background-color: var(--vscode-editor-background);
                    }
                    .setting-container {
                        margin-bottom: 20px;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    .header {
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 5px;
                    }
                    .description {
                        font-size: 12px;
                        opacity: 0.8;
                        margin-bottom: 15px;
                    }
                    .slider-container {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    input[type=range] {
                        flex: 1;
                        accent-color: var(--vscode-button-background);
                    }
                    .value-display {
                        font-weight: bold;
                        min-width: 40px;
                        text-align: right;
                    }
                    button {
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 6px 16px;
                        cursor: pointer;
                        border-radius: 4px;
                        font-weight: 600;
                        width: fit-content;
                    }
                    button:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }
                </style>
            </head>
            <body>
                <div class="setting-container">
                    <div class="header">${headerText}</div>
                    <div class="description">${descriptionText}</div>
                    
                    <div class="slider-container">
                        <input type="range" id="countdownSlider" min="0" max="60" value="${currentDuration}">
                        <span class="value-display" id="durationValue">${currentDuration}${unitText}</span>
                    </div>
                </div>

                <button id="saveBtn">${saveBtnText}</button>

                <script>
                    const vscode = acquireVsCodeApi();
                    
                    const slider = document.getElementById('countdownSlider');
                    const valueDisplay = document.getElementById('durationValue');
                    const saveBtn = document.getElementById('saveBtn');
                    const unitText = '${unitText}';

                    // Update display on slide
                    slider.addEventListener('input', () => {
                        valueDisplay.textContent = slider.value + unitText;
                    });

                    // Save on button click
                    saveBtn.addEventListener('click', () => {
                        vscode.postMessage({
                            type: 'updateCountdown',
                            value: slider.value
                        });
                    });
                </script>
            </body>
            </html>`;
    }
}
exports.SettingsViewProvider = SettingsViewProvider;
SettingsViewProvider.viewType = 'antigravity-auto-accept.settingsView';
//# sourceMappingURL=SettingsViewProvider.js.map