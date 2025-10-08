# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
shopt -s expand_aliases
# Check for rg availability
if ! command -v rg >/dev/null 2>&1; then
  alias rg=''\''C:\Users\yamaj\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\vendor\ripgrep\x64-win32\rg.exe'\'''
fi
export PATH='/mingw64/bin:/usr/bin:/c/Users/yamaj/bin:/c/TwinCAT/Common64:/c/TwinCAT/Common32:/c/Python313/Scripts:/c/Python313:/c/Users/yamaj/AppData/Local/Programs/cursor/resources/app/bin:/c/windows/system32:/c/windows:/c/windows/System32/Wbem:/c/windows/System32/WindowsPowerShell/v1.0:/c/windows/System32/OpenSSH:/c/Program Files/dotnet:/c/Program Files (x86)/CODESYS/APInstaller:/c/Program Files (x86)/Windows Kits/10/Windows Performance Toolkit:/c/Users/yamaj/AppData/Local/Microsoft/WindowsApps:/c/Users/yamaj/AppData/Roaming/Programs/Zero Install:/cmd:/c/Program Files/nodejs:/c/ProgramData/chocolatey/bin:/c/Program Files/CMake/bin:/c/Users/yamaj/AppData/Roaming/Python/Python313/Scripts:/c/WINDOWS/system32:/c/WINDOWS:/c/WINDOWS/System32/Wbem:/c/WINDOWS/System32/WindowsPowerShell/v1.0:/c/WINDOWS/System32/OpenSSH:/c/Program Files/CodeLLM/bin:/c/Program Files/Docker/Docker/resources/bin:/c/Users/yamaj/AppData/Local/Microsoft/WindowsApps:/c/Users/yamaj/AppData/Roaming/Programs/Zero Install:/c/Users/yamaj/AppData/Local/Programs/Microsoft VS Code/bin:/c/Users/yamaj/AppData/Local/Microsoft/WinGet/Links:/c/Users/yamaj/AppData/Roaming/npm:/c/Users/yamaj/AppData/Local/Programs/Microsoft VS Code Insiders/bin:/c/Users/yamaj/AppData/Local/Programs/cursor/resources/app/bin:/c/Users/yamaj/AppData/Local/Programs/Ollama:/c/Users/yamaj/AppData/Local/Microsoft/WindowsApps'
