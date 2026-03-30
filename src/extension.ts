import { exec } from 'child_process';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { SettingsViewProvider } from './SettingsViewProvider';

let isTriggering = false;
let pollingInterval: NodeJS.Timeout | undefined;
let myStatusBarItem: vscode.StatusBarItem;
let isAutoAcceptEnabled = true;

let getIdleScriptPath: string;

export function activate(context: vscode.ExtensionContext) {
    console.log('Antigravity Vintage Polling Auto-Accept is now active!');
    getIdleScriptPath = context.asAbsolutePath('getIdle.ps1');

    const provider = new SettingsViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(SettingsViewProvider.viewType, provider)
    );

    myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    myStatusBarItem.command = 'antigravity-auto-accept.toggle';

    let disposable = vscode.commands.registerCommand('antigravity-auto-accept.toggle', () => {
        isAutoAcceptEnabled = !isAutoAcceptEnabled;
        updateStatusBar();
        if (isAutoAcceptEnabled) {
            startVintagePolling();
            vscode.window.showInformationMessage('Vintage Auto-Accept: ON (Warning: May capture window focus)');
        } else {
            if (pollingInterval) clearInterval(pollingInterval);
            pollingInterval = undefined;
            vscode.window.showInformationMessage('Vintage Auto-Accept: OFF');
        }
    });

    context.subscriptions.push(disposable, myStatusBarItem);

    updateStatusBar();
    startVintagePolling();
}

function updateStatusBar() {
    myStatusBarItem.text = isAutoAcceptEnabled ? `$(check) AutoAccept: ON` : `$(x) AutoAccept: OFF`;
    myStatusBarItem.show();
}

function startVintagePolling() {
    if (pollingInterval) clearInterval(pollingInterval);

    // 修改为每 1 秒轮询一次，用于支持实时的 UI 状态栏倒计时刷新
    pollingInterval = setInterval(() => {
        // 核心修复：当 VS Code 窗口失去焦点（被最小化、或者用户切去了 Chrome 浏览器）时，立刻休眠！
        if (isAutoAcceptEnabled && !vscode.window.state.focused) {
            myStatusBarItem.text = `$(eye-closed) AutoAccept: ON | Paused (Background)`;
            return;
        }

        if (!isAutoAcceptEnabled) return;

        triggerForceFocusKeySimulation();
    }, 1000);
}

// 最原始的自动夺取焦点的 PowerShell 击键
async function triggerForceFocusKeySimulation() {
    if (isTriggering || !isAutoAcceptEnabled) return;
    isTriggering = true;

    // 查询全局 OS 系统空闲时间：判断用户双手是否停留在键盘上
    exec(`powershell -ExecutionPolicy Bypass -File "${getIdleScriptPath}"`, async (err, stdout) => {
        // 核心修复：因为 exec 是异步的，这里如果被中途通过点击关闭了插件，应该直接退出并维持 OFF 状态
        if (!isAutoAcceptEnabled) {
            isTriggering = false;
            updateStatusBar();
            return;
        }

        if (!err) {
            const idleMs = parseInt(stdout.trim(), 10);
            if (!isNaN(idleMs)) {
                const config = vscode.workspace.getConfiguration('antigravity-auto-accept');
                const countdownSec = config.get<number>('countdownDuration', 12);
                const countdownMs = countdownSec * 1000;

                if (idleMs < countdownMs) {
                    const remainingSec = Math.ceil((countdownMs - idleMs) / 1000);
                    myStatusBarItem.text = `$(dashboard) AutoAccept: ON | ${remainingSec}s`;
                    isTriggering = false;
                    return;
                }
            }
        }

        try {
            console.log(`Executing strict Window Focus + OS Key Simulation: Alt+Enter`);
            if (isAutoAcceptEnabled) {
                myStatusBarItem.text = `$(zap) AutoAccept: ON | FIRING!`;
            }

            // 加上一步光标侧边栏对焦，防止 Alt+Enter 打进代码里换行
            try { await vscode.commands.executeCommand('antigravity.agentSidePanel.focus'); } catch (e) { }

            if (!isAutoAcceptEnabled) {
                isTriggering = false;
                updateStatusBar();
                return;
            }

            const psCommand = `powershell -c "$wshell = New-Object -ComObject wscript.shell; if($wshell.AppActivate('Code') -or $wshell.AppActivate('Visual Studio Code')) { Start-Sleep -Milliseconds 150; $wshell.SendKeys('%{ENTER}') } else { $wshell.SendKeys('%{ENTER}') }"`;

            exec(psCommand, (error: any) => {
                if (error) console.error(`Exec error: ${error}`);

                updateStatusBar();
                setTimeout(() => { isTriggering = false; }, 2000); // 间隔两秒后允许下一次触发
            });
        } catch (e) {
            console.error('Failed to simulate keypress', e);
            updateStatusBar();
            isTriggering = false;
        }
    });
}

export function deactivate() {
    if (pollingInterval) clearInterval(pollingInterval);
}
