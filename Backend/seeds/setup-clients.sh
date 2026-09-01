#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Arohan InfoTech - Client Showcase Setup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if MongoDB is running
echo -e "${YELLOW}[1/3] Checking MongoDB connection...${NC}"
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo -e "${YELLOW}⚠ MongoDB CLI tools not found locally${NC}"
    echo -e "${YELLOW}Make sure MongoDB is running on localhost:27017${NC}"
else
    echo -e "${GREEN}✓ MongoDB CLI tools found${NC}"
fi

# Seed the database
echo -e "\n${YELLOW}[2/3] Seeding test data...${NC}"
cd "$(dirname "$0")/.."
node seeds/brandAssetsSeed.js

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ Database seeded successfully!${NC}"
else
    echo -e "\n${YELLOW}⚠ Error seeding database. Make sure MongoDB is running.${NC}"
    exit 1
fi

# Instructions for running the app
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${YELLOW}To start the development server:${NC}\n"
echo -e "${GREEN}Terminal 1 - Backend:${NC}"
echo -e "  cd Backend"
echo -e "  npm install  # if needed"
echo -e "  npm start\n"

echo -e "${GREEN}Terminal 2 - Frontend:${NC}"
echo -e "  cd Frontend"
echo -e "  npm install  # if needed"
echo -e "  npm run dev\n"

echo -e "${YELLOW}Then visit:${NC}"
echo -e "  ${GREEN}Portfolio:${NC} http://localhost:5173/portfolio"
echo -e "  ${GREEN}Admin:${NC} http://localhost:5173/admin (login required)\n"

echo -e "${BLUE}========================================${NC}"
