#!/bin/bash

DIR="gh-pages"
# Test if gh-pages/ exists
if [ ! -d "$DIR" ]; then
    echo cloning vuepress-plugins-public ...
    git clone https://github.com/sabicalija/vuepress-plugins-public.git gh-pages
fi
echo publishing site at https://sabicalija.github.io/vuepress-plugins-public/

# Remove previous build
rm -rf build/ 

# Build site
BASE="/vuepress-plugins-public/" yarn build 

# Remove previously published build
rm -rf gh-pages/* 

# Copy new build
cp -r build/* gh-pages/ 

# Publish build
cd gh-pages/ 
git add . && git commit -m "Publish" && git push