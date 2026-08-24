@echo off
git config --global user.email "teacher@school.com"
git config --global user.name "THPT Teacher"
git add .
git commit -m "Initial commit"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/THPT-Teacher/poisition-student.git
git push -u origin main
