# Antigravity Auto-Accept

**[English]**
A VS Code extension that automatically accepts Antigravity execution prompts by simulating a physical `Alt+Enter` keystroke.

### Features
1. **Auto-Accept**: Automatically clicks the blue `Run Alt+Enter` button in the Antigravity Chat.
2. **OS Idle Protection**: Waits for 12 seconds of complete OS-level idle time (no keyboard or mouse interaction) before triggering, ensuring your typing is never interrupted.
3. **Live Countdown**: Displays a real-time countdown (e.g., `wait 12s`) in the bottom-right status bar, resetting instantly if you touch the mouse or keyboard.
4. **Visual Settings Panel**: Click the Antigravity lightning icon (⚡️) in the left Activity Bar to easily configure the auto-accept countdown duration via a visual slider.
5. **Quick Toggle**: Click the status bar item to toggle the auto-accept engine ON or OFF.

### Requirements
- **Windows OS Only**: Relies on PowerShell and `user32.dll` to read global idle time.

### Installation & Usage
1. Search for `Auto-Accept for Antigravity` in the VS Code Extensions Marketplace and install it.
2. Ensure `AutoAccept: ON` or `wait 12s` is visible in the bottom-right status bar.
4. Trigger an Antigravity manual-approval prompt.
5. Stop moving the mouse or keyboard. The status bar will count down from 12s.
6. At `0s`, the extension automatically focuses the chat panel and presses `Alt+Enter`.

---

**[中文]**
一款通过模拟物理 `Alt+Enter` 按键，全自动确认 Antigravity 执行弹窗的 VS Code 插件。

### 核心功能
1. **自动确认**：全自动点掉 Antigravity 聊天框中的蓝色 `Run Alt+Enter` 运行弹窗。
2. **防误触保护**：严格检测系统底层的闲置时间，只有当鼠标和键盘完全停止操作长达 12 秒后才会触发，彻底杜绝打断打字。
3. **实时倒计时**：右下角状态栏实时显示触发倒计时（如 `wait 12s`），一旦您敲击键盘或轻扫鼠标，倒数瞬间重置以保护输入安全。
4. **可视化设置面板**：点击左侧活动栏的 Antigravity 专属闪电图标 (⚡️)，即可通过滑动条直观地调整自动放行前的等待时间，设置立即生效。
5. **一键开关**：直接点击右下角状态栏图标，即可随时开启或暂停自动执行引擎。

### 系统要求
- **仅限 Windows 系统**：底层强依赖 PowerShell 及 `user32.dll` 以读取全局空闲状态，Mac/Linux 无法运行。

### 安装与使用
1. 在 VS Code 插件市场（Extensions Marketplace）中搜索 `Auto-Accept for Antigravity` 并一键安装。
2. 观察 VS Code 右下角状态栏，确保显示为 `AutoAccept: ON`（或倒计时的时钟）。
4. 触发任何需要点击的 Antigravity 确认蓝框。
6. 倒数结束，插件会自动锁定聊天面板，并帮您模拟物理按下 `Alt+Enter` 放行指令。

---

### 🤝 Contributors / 贡献者
- **HANGUANGWU.**
