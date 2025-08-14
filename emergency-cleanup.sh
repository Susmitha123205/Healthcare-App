#!/bin/bash
echo "🚨 Emergency Disk Space Cleanup..."
rm -rf ~/.npm/_logs/*
rm -rf ~/.npm/_cacache/*
npm cache clean --force
sudo rm -rf /tmp/*
sudo rm -rf /var/tmp/*
sudo rm -rf /var/log/*.log
sudo journalctl --vacuum-time=1d
sudo apt clean
sudo apt autoclean
sudo apt autoremove -y
rm -rf node_modules
rm -rf .next
docker system prune -af --volumes 2>/dev/null || true
echo "✅ Cleanup done!"
df -h
