# Script để push code lên GitHub
# Thay YOUR_GITHUB_USERNAME bằng username GitHub của bạn

$GITHUB_USERNAME = "YOUR_GITHUB_USERNAME"  # Thay đổi ở đây
$REPO_NAME = "tro-choi-hop-qua"

Write-Host "Đang thêm remote repository..." -ForegroundColor Yellow
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

Write-Host "Đang đổi tên branch thành main..." -ForegroundColor Yellow
git branch -M main

Write-Host "Đang push code lên GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "Hoàn thành! Kiểm tra tại: https://github.com/$GITHUB_USERNAME/$REPO_NAME" -ForegroundColor Green

