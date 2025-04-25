# Vacaciones y Permisos

## Project info

**URL**: https://vacaciones.hhrrsrci.online

## Installation Guide

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone <YOUR_REPOSITORY_URL>
cd smart-manager-vacaciones
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the application**
```bash
npm run build
```

The built files will be in the `dist` directory.

### Server Deployment

#### Option 1: Using Apache

1. Copy the contents of the `dist` directory to your Apache web root:
```bash
cp -r dist/* /var/www/html/
```

2. Create or modify the Apache configuration in `/etc/apache2/sites-available/your-site.conf`:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html
    
    <Directory /var/www/html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # React Router support
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-l
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

3. Enable the site and restart Apache:
```bash
sudo a2ensite your-site.conf
sudo systemctl restart apache2
```

#### Option 2: Using Nginx

1. Copy the built files to your Nginx web root:
```bash
cp -r dist/* /usr/share/nginx/html/
```

2. Create or modify the Nginx configuration in `/etc/nginx/sites-available/your-site`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

3. Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Environment Configuration

1. Create a `.env` file in the project root with your environment variables:
```env
VITE_API_URL=https://your-api-url.com
```

2. Rebuild the application after setting environment variables:
```bash
npm run build
```

### SSL Configuration (Recommended)

For production environments, it's strongly recommended to enable HTTPS:

1. Obtain an SSL certificate (you can use Let's Encrypt):
```bash
sudo certbot --apache -d your-domain.com
# or for Nginx
sudo certbot --nginx -d your-domain.com
```

### Maintenance

- To update the application:
```bash
git pull
npm install
npm run build
# Then copy the new dist files to your web root
```

- Monitor the application logs in your web server:
  - Apache: `/var/log/apache2/error.log`
  - Nginx: `/var/log/nginx/error.log`

## Excel Import/Export de Calendarios

### Formato de la plantilla Excel

La plantilla Excel para importar calendarios debe contener al menos las siguientes columnas:

- **ID Trabajador** o **Nombre del Trabajador**: Identificador único del trabajador.
- **Fecha**: En formato DD/MM/YYYY.
- **Turno**: Tipo de turno (Mañana, Tarde, Noche, 24h, Libre, Guardia, etc.).
- **Hora Inicio** (opcional): Hora de inicio del turno.
- **Hora Fin** (opcional): Hora de finalización del turno.
- **Horas** (opcional): Número de horas del turno.
- **Notas** (opcional): Comentarios o información adicional.

### Cómo usar el módulo de importación

1. En la sección de "Gestión de calendarios", selecciona la pestaña "Importar/Exportar Excel".
2. Haz clic en "Seleccionar archivo Excel" y elige tu archivo .xlsx o .xls.
3. Revisa los datos en la vista previa y edita cualquier dato incorrecto si es necesario.
4. Utiliza los filtros de trabajador y mes para visualizar subconjuntos de datos.
5. Haz clic en "Guardar Cambios" para confirmar la importación.

### Cómo usar el módulo de exportación

1. En la sección de "Importar/Exportar Excel", utiliza los filtros para seleccionar los datos que deseas exportar.
2. Haz clic en "Exportar a Excel".
3. El archivo se descargará automáticamente con el nombre "calendario_turnos_FECHA.xlsx".

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/598b4b67-79b6-4e8a-88d3-f670afcb5781) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
