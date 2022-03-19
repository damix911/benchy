#!/bin/sh

rm -rf dist
mkdir dist
mkdir dist/js
cp src/html/*.html dist
tsc