import { execFileSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INSTALLER_CONFIG = path.join(__dirname, '..', 'installer.nsh');

async function createInstaller() {
  // Create NSIS installer script
  const nsisScript = `
    !include "MUI2.nsh"
    !define MUI_PRODUCT "Smart AI CLI"
    !define MUI_FILE "smart-ai"
    !define MUI_VERSION "1.0.0"
    !define MUI_BRANDINGTEXT "Smart AI CLI v\${MUI_VERSION}"
    
    Name "\${MUI_PRODUCT}"
    OutFile "dist/smart-ai-setup.exe"
    InstallDir "$PROGRAMFILES64\\SmartAICLI"
    RequestExecutionLevel admin
    
    !insertmacro MUI_PAGE_WELCOME
    !insertmacro MUI_PAGE_DIRECTORY
    !insertmacro MUI_PAGE_INSTFILES
    !insertmacro MUI_PAGE_FINISH
    
    !insertmacro MUI_UNPAGE_CONFIRM
    !insertmacro MUI_UNPAGE_INSTFILES
    
    !insertmacro MUI_LANGUAGE "English"
    
    Section "Install"
      SetOutPath "$INSTDIR"
      File "dist/smart-ai.exe"
      
      WriteUninstaller "$INSTDIR\\uninstall.exe"
      
      # Add to PATH
      EnVar::AddValue "Path" "$INSTDIR"
      
      # Create Start Menu shortcuts
      CreateDirectory "$SMPROGRAMS\\Smart AI CLI"
      CreateShortcut "$SMPROGRAMS\\Smart AI CLI\\Smart AI CLI.lnk" "$INSTDIR\\smart-ai.exe"
      CreateShortcut "$SMPROGRAMS\\Smart AI CLI\\Uninstall.lnk" "$INSTDIR\\uninstall.exe"
    SectionEnd
    
    Section "Uninstall"
      Delete "$INSTDIR\\smart-ai.exe"
      Delete "$INSTDIR\\uninstall.exe"
      RMDir "$INSTDIR"
      
      # Remove from PATH
      EnVar::DeleteValue "Path" "$INSTDIR"
      
      # Remove Start Menu shortcuts
      Delete "$SMPROGRAMS\\Smart AI CLI\\Smart AI CLI.lnk"
      Delete "$SMPROGRAMS\\Smart AI CLI\\Uninstall.lnk"
      RMDir "$SMPROGRAMS\\Smart AI CLI"
    SectionEnd
  `;

  try {
    // Create dist directory if it doesn't exist
    await fs.mkdir(path.join(__dirname, '..', 'dist'), { recursive: true });
    
    // Write NSIS script
    await fs.writeFile(INSTALLER_CONFIG, nsisScript);
    
    // Run NSIS compiler
    execFileSync('makensis', [INSTALLER_CONFIG], { stdio: 'inherit' });
    
    console.log('Installer created successfully!');
  } catch (error) {
    console.error('Error creating installer:', error.message);
    process.exit(1);
  }
}

createInstaller();
