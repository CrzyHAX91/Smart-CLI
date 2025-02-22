#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Downloading Smart AI CLI...${NC}"

# Create temporary directory
TMP_DIR=$(mktemp -d)
cd $TMP_DIR

# Clone repository
echo -e "${BLUE}Cloning repository...${NC}"
git clone https://github.com/yourusername/smart-ai-cli.git
cd smart-ai-cli

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# Build the project
echo -e "${BLUE}Building project...${NC}"
npm run build

# Create installation directory
INSTALL_DIR="$HOME/.smart-ai-cli"
mkdir -p $INSTALL_DIR

# Copy files to installation directory
echo -e "${BLUE}Installing Smart AI CLI...${NC}"
cp -r dist/* $INSTALL_DIR/
cp package.json $INSTALL_DIR/

# Add to PATH
PROFILE_FILE="$HOME/.bashrc"
if [[ "$OSTYPE" == "darwin"* ]]; then
    PROFILE_FILE="$HOME/.zshrc"
fi

# Add PATH entry if not already present
if ! grep -q "smart-ai-cli" "$PROFILE_FILE"; then
    echo 'export PATH="$HOME/.smart-ai-cli/bin:$PATH"' >> "$PROFILE_FILE"
fi

# Create bin directory and symlink
mkdir -p $INSTALL_DIR/bin
ln -sf $INSTALL_DIR/smart-ai.js $INSTALL_DIR/bin/smart-ai
chmod +x $INSTALL_DIR/bin/smart-ai

# Cleanup
cd
rm -rf $TMP_DIR

echo -e "${GREEN}Installation complete!${NC}"
echo -e "${BLUE}Please restart your terminal or run:${NC}"
echo -e "${GREEN}source $PROFILE_FILE${NC}"
echo
echo -e "${BLUE}Try running:${NC} ${GREEN}smart-ai --help${NC}"
