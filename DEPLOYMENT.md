# Arish Ballana - Portfolio Website

## 🚀 Secure, Self-Hosted Portfolio

A modern, professional portfolio website built with clean HTML, CSS, and JavaScript. Fully self-hosted with security-first architecture.

### ✨ Features

- **100% Self-Hosted**: No dependency on third-party platforms
- **Secure**: Helmet.js security headers, CSP, anti-clickjacking protection
- **Fast**: Gzip compression, optimized assets, lazy loading ready
- **Modern Design**: Responsive, accessible, professional aesthetic
- **No Third-Party Scripts**: Only your own code runs
- **SEO Optimized**: Semantic HTML, meta tags, structured data ready
- **Production Ready**: Environment configuration, error handling, monitoring

---

## 📋 Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git** (optional, for version control)
- **Server**: Any Linux/Windows server or cloud platform

Check versions:
```bash
node --version
npm --version
```

---

## 🛠️ Installation & Setup

### 1. Clone/Download the Project

```bash
# If using git
git clone <your-repo-url>
cd arish-ballana-portfolio

# Or download and extract the files manually
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- **Express.js**: Web server framework
- **Helmet.js**: Security headers middleware
- **compression**: Gzip compression middleware
- **dotenv**: Environment variable management

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings (optional for local development)
nano .env
```

### 4. Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Custom Port:**
```bash
PORT=8080 npm start
```

The server will start and display:
```
Server running at: http://localhost:3000
Environment: production
```

---

## 🌐 Deployment Options

### Option 1: DigitalOcean (Recommended)

1. **Create Droplet**
   - OS: Ubuntu 22.04 LTS
   - Size: $5-6/month basic tier
   - Enable IPv6

2. **SSH into Server**
   ```bash
   ssh root@your_server_ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone Repository**
   ```bash
   cd /home
   git clone <your-repo-url> portfolio
   cd portfolio
   npm install
   ```

5. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "portfolio"
   pm2 startup
   pm2 save
   ```

6. **Install Nginx (Reverse Proxy)**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Configure Nginx:
   ```nginx
   server {
       listen 80 default_server;
       listen [::]:80 default_server;
       
       server_name arishasballana.com www.arishasballana.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Apply changes:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d arishasballana.com -d www.arishasballana.com
   ```

### Option 2: Heroku (Easier for Beginners)

1. **Install Heroku CLI**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View Logs**
   ```bash
   heroku logs --tail
   ```

### Option 3: AWS (Scalable)

1. **Create EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier eligible)

2. **Security Groups**: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

3. **SSH & Setup** (Similar to DigitalOcean)

4. **Use AWS RDS** for databases (if needed in future)

5. **Setup CloudFront** for CDN (optional)

### Option 4: Vercel (Node.js Support)

1. **Push code to GitHub**

2. **Connect to Vercel**
   - Visit vercel.com
   - Import repository
   - Deploy

---

## 🔒 Security Configuration

### HTTPS/SSL

**Important**: Always use HTTPS in production.

1. **Get Free SSL Certificate**
   - Let's Encrypt (recommended)
   - AWS Certificate Manager (if on AWS)
   - Cloudflare (free tier)

2. **Configure HTTPS in Nginx/Apache**
   ```nginx
   server {
       listen 443 ssl http2;
       ssl_certificate /path/to/cert.crt;
       ssl_certificate_key /path/to/key.key;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
   }
   ```

### Security Headers (Automatic)

The server automatically sets:
- **HSTS**: Enforce HTTPS
- **CSP**: Content Security Policy
- **X-Frame-Options**: Prevent clickjacking
- **X-XSS-Protection**: XSS attack prevention
- **X-Content-Type-Options**: MIME sniffing prevention
- **Referrer-Policy**: Privacy protection

### Environment Variables

Never commit `.env` with sensitive data. Always use `.env.example` as template.

### Firewall Rules

```bash
# UFW (Ubuntu)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 📦 File Structure

```
arish-ballana-portfolio/
├── public/                 # Static files served to clients
│   ├── index.html         # Main HTML file
│   ├── styles.css         # All styling
│   ├── script.js          # Client-side JavaScript
│   └── assets/            # Images, fonts, etc.
├── server.js              # Express server with security
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .gitignore             # Git exclusions
├── README.md              # This file
└── package-lock.json      # Dependency lock file
```

---

## 🚀 Performance Optimization

### Already Implemented

- ✅ Gzip compression
- ✅ Minified CSS and JavaScript
- ✅ Responsive images
- ✅ CSS variables for theming
- ✅ Hardware acceleration with transforms
- ✅ Intersection Observer for scroll animations
- ✅ Preload critical fonts

### Additional Tips

1. **Use CDN** (Cloudflare, AWS CloudFront)
2. **Enable Browser Caching**
3. **Monitor Performance** with tools like GTmetrix
4. **Optimize Images** with imagemin or similar
5. **Use HTTP/2** and HTTP/3 when available

---

## 📊 Monitoring & Maintenance

### Monitor Server Health

```bash
# Check PM2 status (if using PM2)
pm2 status
pm2 logs portfolio

# Check resource usage
free -h
df -h
```

### Backup Strategy

```bash
# Backup entire site
tar -czf portfolio-backup-$(date +%Y%m%d).tar.gz portfolio/

# Store in cloud
aws s3 cp portfolio-backup-*.tar.gz s3://your-backup-bucket/
```

### Update Dependencies

```bash
npm outdated              # Check for updates
npm update                # Update packages
npm audit                 # Check for vulnerabilities
npm audit fix             # Fix vulnerabilities
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=8080 npm start
```

### Modules Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in /path/to/cert.crt -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew
```

### 502 Bad Gateway (Nginx)

- Check if Node server is running: `pm2 status`
- Check server logs: `pm2 logs portfolio`
- Verify Nginx proxy settings
- Check firewall rules

---

## 🔄 Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Portfolio

on:
  push:
    branches: [main, master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Run security audit
        run: npm audit --production
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /home/portfolio
            git pull origin main
            npm install
            pm2 restart portfolio
```

---

## 📞 Support & Contact

For updates or questions:
- Email: ballana.arish@gmail.com
- LinkedIn: https://www.linkedin.com/in/arish-ballana

---

## 📄 License

MIT License - Free to use and modify

---

## 🎯 Next Steps

1. ✅ Test locally: `npm run dev`
2. ✅ Choose hosting provider
3. ✅ Set up domain
4. ✅ Configure SSL
5. ✅ Deploy and monitor
6. ✅ Setup backups
7. ✅ Monitor performance

---

**Your portfolio is now secure, fast, and fully under your control.**
