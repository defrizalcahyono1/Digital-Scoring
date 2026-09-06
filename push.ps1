# Hapus Git lama
Remove-Item -Recurse -Force .git

# Buat Git baru
git init
git branch -M main

# Git identity akun baru
git config user.name "defrizalcahyono1"
git config user.email "defrizalcahyono1@gmail.com"

# Buat .gitignore
$gitignore = @"
.env
.env.*
!.env.example

node_modules/
dist/
build/
"@

Set-Content -Path ".gitignore" -Value $gitignore

# Hubungkan repository baru
git remote add origin https://github.com/defrizalcahyono1/Digital-Scoring.git

# Add
git add .

# Cek sebelum commit
git status

# Commit
git commit -m "first commit"

# Push
git push -u origin main